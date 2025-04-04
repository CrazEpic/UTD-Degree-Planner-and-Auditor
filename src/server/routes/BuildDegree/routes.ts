import { Router } from "express"
import { StatusCodes } from "http-status-codes"
import { z } from "zod"
const router = Router()

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

router.post("/insertBlockAtPosition", async (req, res) => {
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

router.delete("/deleteBlock", async (req, res) => {
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

router.put("/updateBlockName", async (req, res) => {
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

router.put("/updateTextBlock", async (req, res) => {
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

router.put("/updateNonterminalBlockCondition", async (req, res) => {
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

export default router
