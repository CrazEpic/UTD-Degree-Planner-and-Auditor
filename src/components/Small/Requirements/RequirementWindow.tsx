import { useEffect, useState, useCallback } from "react"
import { Block, Degree, NonTerminalBlock } from "../../../types/degreeTest"
import BlockView from "../BlockView"
import axios from "axios"
import { Mode } from "../../../types/requirementWindow"
import InsertCourse from "../../DegreeBuilding/DegreeFunctionality/InsertCourse"
import InsertNonterminalButton from "../../DegreeBuilding/DegreeFunctionality/InsertNonterminalButton"
import InsertTextButton from "../../DegreeBuilding/DegreeFunctionality/InsertTextButton"
import SelectNonterminalConditions from "../../DegreeBuilding/DegreeFunctionality/SelectNonterminalConditions"

function createDefaultBlock(): Block {
	return {
		blockID: "",
		blockName: "",
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

function parseBlock(data: any): Block {
	let block = createDefaultBlock()

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

function parseDegree(data: any): Degree {
	let degree: Degree = {
		RootBlock: createDefaultBlock(),
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

const footnotes: string[] = [
	"1. Curriculum Requirements can be fulfilled by other approved courses. The courses listed are recommended as the most efficient way to satisfy both Core Curriculum and Major Requirements at UT Dallas.",
	"2. Semester credit hours fulfill the communication component of the Core Curriculum.",
	"3. Three semester credit hours of Calculus are counted under Mathematics Core, and five semester credit hours of Calculus are counted as Component Area Option Core.",
	"4. Six semester credit hours of Physics are counted under Science core, and one semester credit hour of Physics (PHYS 2125) is counted as Component Area Option Core.",
	"5. Transfer students with sufficient background may petition to substitute upper-division semester credit hours in the major for this class.",
	"6. BS in Data Science students can substitute MATH 3315 for CS 2305.",
	"7. BS in Data Science students can substitute STAT 3355 for CS 3341.",
]

// Currently does not work because of camelCase change not merged
const RequirementWindow = ({ degreeName, degreeYear, mode }: { degreeName: string; degreeYear: string; mode: Mode }) => {
	const [degree, setDegree] = useState<Degree | null>(null)

	const fetchDegree = useCallback(async () => {
		try {
			const response = await axios.get(`http://localhost:3000/api/degree/${degreeName}/${degreeYear}`)
			setDegree(parseDegree(response.data))
		} catch (error) {
			console.log(error)
		}
	}, [degreeName, degreeYear])

	useEffect(() => {
		fetchDegree()
	}, [degreeName, degreeYear, fetchDegree])

	return (
		<>
			<div className="flex flex-col gap-2 max-lg:mt-4 border-black border-2">
				<h1 className="text-2xl text-center">{`${degree?.degreeName} ${degree?.degreeYear}`}</h1>
				{mode === "EDIT" && degree && (
					<>
						<div className="flex flex-row gap-2">
							<InsertNonterminalButton
								blockID={degree?.RootBlock.blockID}
								insertPosition={
									degree?.RootBlock.innerBlocks.length != 0 ? degree?.RootBlock.innerBlocks[degree?.RootBlock.innerBlocks.length - 1].blockPosition + 1 : 0
								}
								fetchDegree={fetchDegree}
							/>
							<InsertCourse
								blockID={degree?.RootBlock.blockID}
								insertPosition={
									degree?.RootBlock.innerBlocks.length != 0 ? degree?.RootBlock.innerBlocks[degree?.RootBlock.innerBlocks.length - 1].blockPosition + 1 : 0
								}
								fetchDegree={fetchDegree}
							/>
							<InsertTextButton
								blockID={degree?.RootBlock.blockID}
								insertPosition={
									degree?.RootBlock.innerBlocks.length != 0 ? degree?.RootBlock.innerBlocks[degree?.RootBlock.innerBlocks.length - 1].blockPosition + 1 : 0
								}
								fetchDegree={fetchDegree}
							/>
							<SelectNonterminalConditions
								nonterminalBlockID={degree?.RootBlock.blockContent.id}
								conditions={(degree?.RootBlock.blockContent as NonTerminalBlock).conditions}
								fetchDegree={fetchDegree}
							/>
						</div>
					</>
				)}
				{degree?.RootBlock.innerBlocks.map((inner: Block) => (
					<BlockView key={inner.blockID} requirement={inner} depth={1} checkbox={false} fetchDegree={fetchDegree} mode={mode}></BlockView>
				))}

				{/* Add unrelated courses */}

				{mode !== "EDIT" && (
					<BlockView
						requirement={{
							blockID: "",
							blockName: "Unrelated Courses",
							parentBlockID: "",
							blockPosition: 0,
							innerBlocks: [
								{
									blockID: "",
									blockName: "",
									parentBlockID: "",
									blockPosition: 0,
									innerBlocks: [],
									blockType: "MatcherGroup",
									blockContent: {
										id: "",
										conditions: {},
									},
								},
							],
							blockType: "NonTerminal",
							blockContent: {
								id: "",
								conditions: {},
							},
						}}
						depth={1}
						checkbox={false}
						fetchDegree={fetchDegree}
						mode={mode}
					></BlockView>
				)}

				{/* Add a disclosure tag just for the footnotes to hide them when unwanted*/}
				{footnotes.map((footnote) => (
					<p>{footnote}</p>
				))}
			</div>
		</>
	)
}

export default RequirementWindow
