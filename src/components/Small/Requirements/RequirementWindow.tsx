import { useEffect, useState, useCallback } from "react"
import { CourseBlock, Degree, FlagToggleBlock, MatcherGroupBlock, NonTerminalBlock, TextBlock } from "../../../types/degreeTest"
import BlockView from "../../BlockViews/BlockView"
import axios from "axios"
import CourseBlockView from "../../BlockViews/CourseBlockView"
import MatcherBlockView from "../../BlockViews/MatcherBlockView"
import TextBlockView from "../../BlockViews/TextBlockView"
import NonterminalConditions from "../NonterminalConditions"
import { parseDegree } from "../../../utils/degreeParsing"
import { Mode } from "../../../types/requirementWindow"

// Get footnotes some other way
const footnotes: string[] = [
	"1. Curriculum Requirements can be fulfilled by other approved courses. The courses listed are recommended as the most efficient way to satisfy both Core Curriculum and Major Requirements at UT Dallas.",
	"2. Semester credit hours fulfill the communication component of the Core Curriculum.",
	"3. Three semester credit hours of Calculus are counted under Mathematics Core, and five semester credit hours of Calculus are counted as Component Area Option Core.",
	"4. Six semester credit hours of Physics are counted under Science core, and one semester credit hour of Physics (PHYS 2125) is counted as Component Area Option Core.",
	"5. Transfer students with sufficient background may petition to substitute upper-division semester credit hours in the major for this class.",
	"6. BS in Data Science students can substitute MATH 3315 for CS 2305.",
	"7. BS in Data Science students can substitute STAT 3355 for CS 3341.",
]

const RequirementWindow = ({ degreeName, degreeYear, mode }: { degreeName: string; degreeYear: string; mode: Mode; }) => {
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

	console.log("degree", degree)

	return (
		<>
			<div className="flex flex-col gap-2 max-lg:mt-4">
				<h1 className="text-2xl text-center">{`${degree?.degreeName} ${degree?.degreeYear}`}</h1>
				{degree?.RootBlock.blockType === "NonTerminal" && (
					<NonterminalConditions
						nonterminalBlockID={degree?.RootBlock.blockContent.id}
						conditions={(degree?.RootBlock.blockContent as NonTerminalBlock).conditions}
						mode={"VIEW"}
						fetchDegree={fetchDegree}
					/>
				)}
				{/* Recursive Blocks */}
				{degree?.RootBlock.innerBlocks.map((inner) => {
					switch (inner.blockType) {
						case "NonTerminal":
							return <BlockView requirement={inner} depth={1} checkbox={false} fetchDegree={fetchDegree} mode={mode}></BlockView>
						case "Course":
							return (
								<div className="flex flex-row w-full">
									<CourseBlockView course={inner.blockContent as CourseBlock} name={inner.blockName} indent={true} mode={mode}></CourseBlockView>
								</div>
							)
						case "Text":
							return (
								<div className="flex flex-row w-full">
									<TextBlockView
										textBlockID={inner.blockContent.id}
										text={(inner.blockContent as TextBlock).text}
										mode={mode}
										fetchDegree={fetchDegree}
									/>
								</div>
							)
						case "MatcherGroup":
							return <MatcherBlockView matcher={inner.blockContent as MatcherGroupBlock}></MatcherBlockView>
						case "FlagToggle":
							return <p>{(inner.blockContent as FlagToggleBlock).flagId}</p>
						default:
							return <p>Unknown Block Type</p>
					}
				})}

				{/* Add unrelated courses */}
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
					mode={"VIEW"}
				></BlockView>


				{/* Add a disclosure tag just for the footnotes to hide them when unwanted*/}
				{footnotes.map((footnote) => (
					<p>{footnote}</p>
				))}
			</div>
		</>
	)
}

export default RequirementWindow
