import { Router } from "express"
import { StatusCodes } from "http-status-codes"
const router = Router()

// get all degrees
router.get("/degrees", async (req, res) => {
	const degrees = await req.context.prisma.degree.findMany()
	res.json(degrees)
})

// TODO: CACHE THIS WITH REDIS PLEASE
router.get("/:name/:year", async (req, res) => {
	const { name, year } = req.params
	const degree = await req.context.prisma.degree.findUnique({
		where: { degreeID: { degreeName: name, degreeYear: year } },
		include: { RootBlock: true },
	})
	if (!degree) {
		return res.status(StatusCodes.NOT_FOUND).send("Degree not found")
	}

	// probably not a security issue because degree.degreeID is not directly controlled by client
	const rawblock = await req.context.prisma.$queryRaw`WITH RECURSIVE BlockHierarchy AS
        (SELECT block_id, block_name, parent_block_id, block_position FROM block_requirement WHERE parent_block_id IS NULL AND block_id = ${degree.blockID}
            UNION ALL
            SELECT b.block_id, b.block_name, b.parent_block_id, b.block_position FROM block_requirement b INNER JOIN BlockHierarchy bh ON b.parent_block_id = bh.block_id)
        SELECT * FROM BlockHierarchy`

	// back to camelCase
	const block = rawblock.map((b) => {
		return {
			blockID: b.block_id,
			blockName: b.block_name,
			parentBlockID: b.parent_block_id,
			blockPosition: b.block_position,
		}
	})
	// need to bring back typings for each block
	const blockIDs = block.map((b) => b.blockID)

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
		b.innerBlocks = {} // initialize innerBlocks
		const nonterminalBlock = nonterminalBlocks.find((nb) => nb.id === b.blockID)
		if (nonterminalBlock) {
			b.NonTerminalBlock = nonterminalBlock
		}
		const courseBlock = courseBlocks.find((cb) => cb.id === b.blockID)
		if (courseBlock) {
			b.CourseBlock = courseBlock
		}
		const textBlock = textBlocks.find((tb) => tb.id === b.blockID)
		if (textBlock) {
			b.TextBlock = textBlock
		}
		const matcherGroupBlock = matcherGroupBlocks.find((mgb) => mgb.id === b.blockID)
		if (matcherGroupBlock) {
			b.MatcherGroupBlock = matcherGroupBlock
		}
		const flagToggleBlock = flagToggleBlocks.find((ftb) => ftb.id === b.blockID)
		if (flagToggleBlock) {
			b.FlagToggleBlock = flagToggleBlock
		}
	})
	const blocksSameParent = Object.groupBy(block, (b) => b.parentBlockID)
	// sort the blocks by their position
	Object.keys(blocksSameParent).forEach((key) => {
		blocksSameParent[key].sort((a, b) => a.blockPosition - b.blockPosition)
	})

	const queue = [blocksSameParent[null][0]] // start with the root block (parentBlockID is null)
	while (queue.length > 0) {
		const currentBlock = queue.shift()
		if (blocksSameParent[currentBlock.blockID] === undefined) continue // if no children, skip
		blocksSameParent[currentBlock.blockID].forEach((b) => {
			currentBlock.innerBlocks[b.blockID] = b
			queue.push(b)
		})
	}

	degree.RootBlock = blocksSameParent[null][0]

	res.send(degree)
})

export default router
