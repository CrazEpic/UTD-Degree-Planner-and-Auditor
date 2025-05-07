import { Block, Degree } from "../types/degreeTest";

export const createDefaultBlock = (id: number) : Block => {
	return {
		blockID: id.toString(),
		blockName: "Requirement",
		parentBlockID: "",
		blockPosition: 0,
		innerBlocks: [],
		blockType: "NonTerminal",
		blockContent: {
			id: "",
			conditions: {},
		},
	}
}

const parseBlock = (data:any) : Block => {
	let block = createDefaultBlock(0)

	block.blockID = data.blockID
	block.blockName = data.blockName
	block.parentBlockID = data.parentBlockID
	block.blockPosition = data.blockPosition

	if (data.NonTerminalBlock) {
		block.blockType = "NonTerminal"
		block.blockContent = {
			id: data.NonTerminalBlock.id,
			conditions: data.NonTerminalBlock.conditions,
		}

		if (data.innerBlocks && typeof data.innerBlocks === "object") {
			for (const inner of Object.values(data.innerBlocks)) {
				block.innerBlocks.push(parseBlock(inner))
			}
		}
	} else if (data.CourseBlock) {
		block.blockType = "Course"
		block.blockContent = {
			id: data.CourseBlock.id,
			Course: {
				id: data.CourseBlock.id,
				prefix: data.CourseBlock.prefix,
				number: data.CourseBlock.number,
				name: data.CourseBlock.Course.name,
			},
			number: data.CourseBlock.number,
			prefix: data.CourseBlock.prefix,
		}
	} else if (data.TextBlock) {
		block.blockType = "Text"
		block.blockContent = {
			id: data.TextBlock.id,
			text: data.TextBlock.text,
		}
	} else if (data.MatcherGroupBlock) {
		block.blockType = "MatcherGroup"
		block.blockContent = {
			id: data.MatcherGroupBlock.id,
			matcher: data.MatcherGroupBlock.matcher,
		}
	} else if (data.FlagToggleBlock) {
		block.blockType = "FlagToggle"
		block.blockContent = {
			id: data.FlagToggleBlock.id,
			flag: data.FlagToggleBlock.flag,
			flagId: data.FlagToggleBlock.flagId,
		}
	}

	return block
}

export const parseDegree = (data: any) : Degree => {
	let degree: Degree = {
		RootBlock: createDefaultBlock(0),
		blockID: "",
		degreeName: "",
		degreeYear: "",
	}

	degree.RootBlock = parseBlock(data.RootBlock)
	degree.blockID = data.blockID
	degree.degreeName = data.degreeName
	degree.degreeYear = data.degreeYear

	return degree
}