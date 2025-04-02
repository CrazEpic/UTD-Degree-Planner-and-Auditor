import { Router } from "express"

const router = Router()

// TODO: CACHE THIS WITH REDIS PLEASE
router.get("/", async (req, res) => {
	// res.json({ message: "Hello from the test routes!" })
	const block = await req.context.prisma.$queryRaw`WITH RECURSIVE BlockHierarchy AS 
        (SELECT block_id, block_name, parent_block_id FROM block_requirement WHERE parent_block_id IS NULL 
            UNION ALL 
            SELECT b.block_id, b.block_name, b.parent_block_id FROM block_requirement b INNER JOIN BlockHierarchy bh ON b.parent_block_id = bh.block_id) 
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
	const queue = [blocks_same_parent[null][0]] // start with the root block (parent_block_id is null)
	while (queue.length > 0) {
		const currentBlock = queue.shift()
		if (blocks_same_parent[currentBlock.block_id] === undefined) continue // if no children, skip
		blocks_same_parent[currentBlock.block_id].forEach((b) => {
			currentBlock.inner_blocks[b.block_id] = b
			queue.push(b)
		})
	}

	res.json(blocks_same_parent[null][0])
})

// make everything a flat route for now and refactor later
router.post("/login", async (req, res) => {
	res.send("login")
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
