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

	res.send(degree)
})

export default router
