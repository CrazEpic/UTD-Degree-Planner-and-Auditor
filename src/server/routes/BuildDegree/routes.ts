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
			degreeName: name,
			degreeYear: year,
			RootBlock: {
				create: {
					blockName: "Default Root Block", // Replace with appropriate default values
				},
			},
		},
	})
	res.json(degree)
})

router.post("/insertBlockAtPosition", async (req, res) => {
	const { data, error } = z
		.object({
			parentBlockID: z.string(),
			position: z.number().nonnegative(),
			blockTypeInformation: z.discriminatedUnion("blockType", [
				z.object({ blockType: z.literal("NONTERMINAL") }),
				z.object({ blockType: z.literal("COURSE"), prefix: z.string(), number: z.string() }),
				z.object({ blockType: z.literal("TEXT") }),
			]),
		})
		.strict()
		.required()
		.safeParse(req.body)
	if (error) {
		return res.status(StatusCodes.BAD_REQUEST).send(error.errors)
	}
	const { parentBlockID, position, blockTypeInformation } = data
	const { blockType } = blockTypeInformation
	// fix positions of other blocks with same parent
	await req.context.prisma.blockRequirement.updateMany({
		where: {
			parentBlockID: parentBlockID,
			blockPosition: { gte: position },
		},
		data: {
			blockPosition: { increment: 1 },
		},
	})
	const block = await req.context.prisma.blockRequirement.create({
		data: {
			blockName: "New Block",
			blockPosition: position,
			parentBlockID: parentBlockID,
		},
	})
	switch (blockType) {
		case "NONTERMINAL":
			await req.context.prisma.nonterminalBlock.create({
				data: {
					id: block.blockID,
					conditions: {},
				},
			})
			break
		case "COURSE":
			await req.context.prisma.courseBlock.create({
				data: {
					id: block.blockID,
					prefix: blockTypeInformation.prefix,
					number: blockTypeInformation.number,
				},
			})
			break
		case "TEXT":
			await req.context.prisma.textBlock.create({
				data: {
					id: block.blockID,
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
			blockID: z.string(),
		})
		.strict()
		.required()
		.safeParse(req.body)
	if (error) {
		return res.status(StatusCodes.BAD_REQUEST).send(error.errors)
	}
	const { blockID } = data
	const block = await req.context.prisma.blockRequirement.delete({
		where: { blockID: blockID },
	})
	res.json(block)
})

router.put("/updateBlockName", async (req, res) => {
	const { data, error } = z
		.object({
			blockID: z.string(),
			blockName: z.string(),
		})
		.strict()
		.required()
		.safeParse(req.body)
	if (error) {
		return res.status(StatusCodes.BAD_REQUEST).send(error.errors)
	}
	const { blockID, blockName } = data
	const block = await req.context.prisma.blockRequirement.update({
		where: { blockID: blockID },
		data: { blockName: blockName },
	})
	res.json(block)
})

router.put("/updateTextBlock", async (req, res) => {
	const { data, error } = z
		.object({
			blockID: z.string(),
			text: z.string(),
		})
		.strict()
		.required()
		.safeParse(req.body)
	if (error) {
		return res.status(StatusCodes.BAD_REQUEST).send(error.errors)
	}
	const { blockID, text } = data
	const block = await req.context.prisma.textBlock.update({
		where: { id: blockID },
		data: { text: text },
	})
	res.json(block)
})

router.put("/updateNonterminalBlockCondition", async (req, res) => {
	const { data, error } = z
		.object({
			blockID: z.string(),
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
	const { blockID, conditions } = data
	const block = await req.context.prisma.nonterminalBlock.update({
		where: { id: blockID },
		data: { conditions: conditions },
	})
	res.json(block)
})

export default router
