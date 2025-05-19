import { Router } from "express"
import { StatusCodes } from "http-status-codes"
import { routeSchemas } from "../routeSchema"
const router = Router()

// DEGREE BUILDING STUFF

// TODO: think about when a degree is deleted, the cascade delete

router.post("/degree", async (req, res) => {
	const { data, error } = routeSchemas["/api/buildDegree/degree - post"].safeParse(req.body)
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
					NonterminalBlock: {
						create: {
							conditions: {},
						},
					},
				},
			},
		},
	})
	res.json(degree)
})

router.post("/insertBlockAtPosition", async (req, res) => {
	const { data, error } = routeSchemas["/api/buildDegree/insertBlockAtPosition - post"].safeParse(req.body)
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
	const { data, error } = routeSchemas["/api/buildDegree/deleteBlock - delete"].safeParse(req.body)
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
	const { data, error } = routeSchemas["/api/buildDegree/updateBlockName - put"].safeParse(req.body)
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
	const { data, error } = routeSchemas["/api/buildDegree/updateTextBlock - put"].safeParse(req.body)
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
	const { data, error } = routeSchemas["/api/buildDegree/updateNonterminalBlockCondition - put"].safeParse(req.body)
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
