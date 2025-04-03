import { StatusCodes } from "http-status-codes"
import { Router } from "express"
import { z } from "zod"

const router = Router()

// TODO: CACHE THIS WITH REDIS PLEASE
router.get("/", async (req, res) => {
	// res.json({ message: "Hello from the test routes!" })
})

// make everything a flat route for now and refactor later
router.post("/login", async (req, res) => {
	res.send("login")
})

router.get("/degree/:name/:year", async (req, res) => {
	const { name, year } = req.params
	const degree = await req.context.prisma.degree.findUnique({
		where: { degree_id: { degree_name: name, degree_year: year } },
		include: { RootBlock: true },
	})
	if (!degree) {
		return res.status(StatusCodes.NOT_FOUND).send("Degree not found")
	}

	// probably not a security issue because degree.degree_id is not directly controlled by client
	const block = await req.context.prisma.$queryRaw`WITH RECURSIVE BlockHierarchy AS
	    (SELECT block_id, block_name, parent_block_id, block_position FROM block_requirement WHERE parent_block_id IS NULL AND block_id = ${degree.block_id}
	        UNION ALL
	        SELECT b.block_id, b.block_name, b.parent_block_id, b.block_position FROM block_requirement b INNER JOIN BlockHierarchy bh ON b.parent_block_id = bh.block_id)
	    SELECT * FROM BlockHierarchy`
	// need to bring back typings for each block
	const blockIDs = block.map((b) => b.block_id)

	const nonterminalBlocks = await req.context.prisma.nonterminalBlock.findMany({
		where: { id: { in: blockIDs } },
	})
	const courseBlocks = await req.context.prisma.courseBlock.findMany({
		where: { id: { in: blockIDs } },
	})
	const textBlocks = await req.context.prisma.textBlock.findMany({
		where: { id: { in: blockIDs } },
	})
	const matcherGroupBlocks = await req.context.prisma.matcherGroupBlock.findMany({
		where: { id: { in: blockIDs } },
	})
	const flagToggleBlocks = await req.context.prisma.flagToggleBlock.findMany({
		where: { id: { in: blockIDs } },
	})

	// recursive query returns a flattened list, need to rebuild the tree structure
	block.forEach((b) => {
		b.inner_blocks = {} // initialize inner_blocks
		const nonterminalBlock = nonterminalBlocks.find((nb) => nb.id === b.block_id)
		if (nonterminalBlock) {
			b.NonTerminalBlock = nonterminalBlock
		}
		const courseBlock = courseBlocks.find((cb) => cb.id === b.block_id)
		if (courseBlock) {
			b.CourseBlock = courseBlock
		}
		const textBlock = textBlocks.find((tb) => tb.id === b.block_id)
		if (textBlock) {
			b.TextBlock = textBlock
		}
		const matcherGroupBlock = matcherGroupBlocks.find((mgb) => mgb.id === b.block_id)
		if (matcherGroupBlock) {
			b.MatcherGroupBlock = matcherGroupBlock
		}
		const flagToggleBlock = flagToggleBlocks.find((ftb) => ftb.id === b.block_id)
		if (flagToggleBlock) {
			b.FlagToggleBlock = flagToggleBlock
		}
	})
	const blocks_same_parent = Object.groupBy(block, (b) => b.parent_block_id)
	// sort the blocks by their position
	Object.keys(blocks_same_parent).forEach((key) => {
		blocks_same_parent[key].sort((a, b) => a.block_position - b.block_position)
	})

	const queue = [blocks_same_parent[null][0]] // start with the root block (parent_block_id is null)
	while (queue.length > 0) {
		const currentBlock = queue.shift()
		if (blocks_same_parent[currentBlock.block_id] === undefined) continue // if no children, skip
		blocks_same_parent[currentBlock.block_id].forEach((b) => {
			currentBlock.inner_blocks[b.block_id] = b
			queue.push(b)
		})
	}

	degree.RootBlock = blocks_same_parent[null][0]

	// res.json(blocks_same_parent[null][0])
	res.send(degree)
})

// DEGREE BUILDING STUFF

// TODO: think about when a degree is deleted, the cascade delete

router.post("/degree", async (req, res) => {
	const { data, error } = z
		.object({
			name: z.string(),
			year: z.string(),
		})
		.strict()
		.required()
		.safeParse(req.body)
	if (error) {
		return res.status(StatusCodes.BAD_REQUEST).send(error.errors)
	}
	const { name, year } = data
	const degree = await req.context.prisma.degree.create({
		data: {
			degree_name: name,
			degree_year: year,
			RootBlock: {
				create: {
					block_name: "Default Root Block", // Replace with appropriate default values
				},
			},
		},
	})
	res.json(degree)
})

router.post("/degree/edit/insertBlockAtPosition", async (req, res) => {
	const { data, error } = z
		.object({
			parent_block_id: z.string(),
			position: z.number().nonnegative(),
			block_type_information: z.discriminatedUnion("block_type", [
				z.object({ block_type: z.literal("NONTERMINAL") }),
				z.object({ block_type: z.literal("COURSE"), prefix: z.string(), number: z.string() }),
				z.object({ block_type: z.literal("TEXT") }),
			]),
		})
		.strict()
		.required()
		.safeParse(req.body)
	if (error) {
		return res.status(StatusCodes.BAD_REQUEST).send(error.errors)
	}
	const { parent_block_id, position, block_type_information } = data
	const { block_type } = block_type_information
	// fix positions of other blocks with same parent
	await req.context.prisma.blockRequirement.updateMany({
		where: {
			parent_block_id: parent_block_id,
			block_position: { gte: position },
		},
		data: {
			block_position: { increment: 1 },
		},
	})
	const block = await req.context.prisma.blockRequirement.create({
		data: {
			block_name: "New Block",
			block_position: position,
			parent_block_id: parent_block_id,
		},
	})
	switch (block_type) {
		case "NONTERMINAL":
			await req.context.prisma.nonterminalBlock.create({
				data: {
					id: block.block_id,
					conditions: {},
				},
			})
			break
		case "COURSE":
			await req.context.prisma.courseBlock.create({
				data: {
					id: block.block_id,
					prefix: block_type_information.prefix,
					number: block_type_information.number,
				},
			})
			break
		case "TEXT":
			await req.context.prisma.textBlock.create({
				data: {
					id: block.block_id,
				},
			})
			break
		default:
			break
	}
	res.json(block)
})

router.delete("/degree/edit/deleteBlock", async (req, res) => {
	const { data, error } = z
		.object({
			block_id: z.string(),
		})
		.strict()
		.required()
		.safeParse(req.body)
	if (error) {
		return res.status(StatusCodes.BAD_REQUEST).send(error.errors)
	}
	const { block_id } = data
	try {
		const block = await req.context.prisma.blockRequirement.delete({
			where: { block_id: block_id },
		})
		res.json(block)
	} catch (error) {
		console.log(error)
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error deleting block")
	}
})

router.put("/degree/edit/updateBlockName", async (req, res) => {
	const { data, error } = z
		.object({
			block_id: z.string(),
			block_name: z.string(),
		})
		.strict()
		.required()
		.safeParse(req.body)
	if (error) {
		return res.status(StatusCodes.BAD_REQUEST).send(error.errors)
	}
	const { block_id, block_name } = data
	const block = await req.context.prisma.blockRequirement.update({
		where: { block_id: block_id },
		data: { block_name: block_name },
	})
	res.json(block)
})

router.put("/degree/edit/updateTextBlock", async (req, res) => {
	const { data, error } = z
		.object({
			block_id: z.string(),
			text: z.string(),
		})
		.strict()
		.required()
		.safeParse(req.body)
	if (error) {
		return res.status(StatusCodes.BAD_REQUEST).send(error.errors)
	}
	const { block_id, text } = data
	const block = await req.context.prisma.textBlock.update({
		where: { id: block_id },
		data: { text: text },
	})
	res.json(block)
})

router.put("/degree/edit/updateNonterminalBlockCondition", async (req, res) => {
	const { data, error } = z
		.object({
			block_id: z.string(),
			conditions: z
				.object({
					blockFulfillmentCondition: z
						.object({
							minBlocksToFulfill: z.number().positive(),
						})
						.optional(),
					blockInclusionCondition: z
						.object({
							minBlocksToInclude: z.number().positive(),
						})
						.optional(),
					creditHourCondition: z
						.object({
							minCreditHours: z.number().positive(),
						})
						.optional(),
					levelCondition: z
						.object({
							creditHourRequirement: z.number().positive(),
							level: z.enum(["1000", "2000", "3000", "4000", "UPPER_DIVISION"]),
						})
						.optional(),
					hourBeyondBlockCondition: z
						.object({
							blockKey: z.string(),
							hoursBeyondBlock: z.number().positive(),
						})
						.optional(),
				})
				.strict(),
		})
		.strict()
		.required()
		.safeParse(req.body)
	if (error) {
		return res.status(StatusCodes.BAD_REQUEST).send(error.errors)
	}
	const { block_id, conditions } = data
	const block = await req.context.prisma.nonterminalBlock.update({
		where: { id: block_id },
		data: { conditions: conditions },
	})
	res.json(block)
})

// Login + Authentication
// Planner
//     Switch between planner and graph
//     Move Course (if moved onto a semester, it is locked), Remove Course, Link Course to Requirement, and Unlink
//     Locking hours for a semester
//     Given list of courses, show transferable credit
//         Also do this for requirements tab
// Prereq Tab -
//     Fetch the prereq
//     Handle user prereq selection/options
// Requirements Tab
//     Fetch the degree
//     Put course onto planner
//     Selecting an optional block
//     Unselecting an optional block
//     Maybe an API call to handle select and unselect another block
//     Matcher - API call for the specific matcher to return list of relevant courses
//     Flag Toggle - on and off
//     Search
//         Timer on key stop (dot dot dot API call)
// Building
//     Progress bar option on and off (THINK MORE ABOUT IT)
// Flowchart
// Test Credits
// Transfer Credits

export default router
