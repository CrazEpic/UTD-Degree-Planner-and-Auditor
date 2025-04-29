import { useEffect, useState, useCallback } from "react"
import { CourseBlock, Degree, FlagToggleBlock, MatcherGroupBlock, NonTerminalBlock, TextBlock } from "../types/degreeTest"
import BlockView from "./BlockViews/BlockView"
import axios from "axios"
import InsertCourse from "./DegreeBuilding/DegreeFunctionality/InsertCourse"
import InsertNonterminalButton from "./DegreeBuilding/DegreeFunctionality/InsertNonterminalButton"
import InsertTextButton from "./DegreeBuilding/DegreeFunctionality/InsertTextButton"
import SelectNonterminalConditions from "./DegreeBuilding/DegreeFunctionality/SelectNonterminalConditions"
import { Button } from "@headlessui/react"
import { TrashIcon } from "@heroicons/react/24/outline"
import CourseBlockView from "./BlockViews/CourseBlockView"
import MatcherBlockView from "./BlockViews/MatcherBlockView"
import TextBlockView from "./BlockViews/TextBlockView"
import NonterminalConditions from "./Small/NonterminalConditions"
import { parseDegree } from "../utils/degreeParsing"

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

const RequirementWindow = ({ degreeName, degreeYear}: { degreeName: string; degreeYear: string; }) => {
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
			<div className="flex flex-col gap-2">
				<h1 className="text-2xl text-center">{`${degree?.degreeName} ${degree?.degreeYear}`}</h1>

				{/* TODO: Move the rest of the buttons back up here */}
				{degree && degree.RootBlock.innerBlocks.length > 0 && (
					<div className="max-lg:w-60">
						<SelectNonterminalConditions
							nonterminalBlockID={degree?.RootBlock.blockContent.id}
							conditions={(degree?.RootBlock.blockContent as NonTerminalBlock).conditions}
							fetchDegree={fetchDegree}
						/>
					</div>
				)}
				{degree?.RootBlock.blockType === "NonTerminal" && (
					<NonterminalConditions
						nonterminalBlockID={degree?.RootBlock.blockContent.id}
						conditions={(degree?.RootBlock.blockContent as NonTerminalBlock).conditions}
						mode={"EDIT"}
						fetchDegree={fetchDegree}
					/>
				)}
				{/* Recursive Blocks */}
				{degree?.RootBlock.innerBlocks.map((inner) => {
					switch (inner.blockType) {
						case "NonTerminal":
							return <BlockView requirement={inner} depth={1} checkbox={false} fetchDegree={fetchDegree} mode={"EDIT"}></BlockView>
						case "Course":
							return (
								<div className="flex flex-row w-full">
									<CourseBlockView course={inner.blockContent as CourseBlock} name={inner.blockName} indent={true} mode={"EDIT"}></CourseBlockView>
									{/* FIX THIS LATER PLEASE */}
                                    <Button
                                        className="border-2 rounded-md hover:bg-red-200 size-fit"
                                        onClick={async () => {
                                            try {
                                                await axios.delete("http://localhost:3000/api/buildDegree/deleteBlock", {
                                                    data: {
                                                        blockID: inner.blockID,
                                                    },
                                                })
                                                fetchDegree()
                                            } catch (error) {
                                                console.log(error)
                                            }
                                        }}
                                    >
                                        <TrashIcon className="lg:size-6 max-lg:size-8"></TrashIcon>
                                    </Button>
								</div>
							)
						case "Text":
							return (
								<div className="flex flex-row w-full">
									<TextBlockView
										textBlockID={inner.blockContent.id}
										text={(inner.blockContent as TextBlock).text}
										mode={"EDIT"}
										fetchDegree={fetchDegree}
									/>
									{/* FIX THIS LATER PLEASE */}
                                    <Button
                                        className="border-2 rounded-md hover:bg-red-200"
                                        onClick={async () => {
                                            try {
                                                await axios.delete("http://localhost:3000/api/buildDegree/deleteBlock", {
                                                    data: {
                                                        blockID: inner.blockID,
                                                    },
                                                })
                                                fetchDegree()
                                            } catch (error) {
                                                console.log(error)
                                            }
                                        }}
                                    >
                                        <TrashIcon className="lg:size-6 max-lg:size-8"></TrashIcon>
                                    </Button>
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
				{degree &&
					<div className="flex lg:flex-row max-lg:flex-col gap-2 lg:items-center max-lg:w-60">
						<InsertNonterminalButton
							blockID={degree?.RootBlock.blockID}
							insertPosition={
								degree?.RootBlock.innerBlocks.length != 0
									? degree?.RootBlock.innerBlocks[degree?.RootBlock.innerBlocks.length - 1].blockPosition + 1
									: 0
							}
							fetchDegree={fetchDegree}
						/>
						<InsertCourse
							blockID={degree?.RootBlock.blockID}
							insertPosition={
								degree?.RootBlock.innerBlocks.length != 0
									? degree?.RootBlock.innerBlocks[degree?.RootBlock.innerBlocks.length - 1].blockPosition + 1
									: 0
							}
							fetchDegree={fetchDegree}
						/>
						<InsertTextButton
							blockID={degree?.RootBlock.blockID}
							insertPosition={
								degree?.RootBlock.innerBlocks.length != 0
									? degree?.RootBlock.innerBlocks[degree?.RootBlock.innerBlocks.length - 1].blockPosition + 1
									: 0
							}
							fetchDegree={fetchDegree}
						/>
					</div>
				}

				{/* Add a disclosure tag just for the footnotes to hide them when unwanted 

				{footnotes.map((footnote) => (
					<p>{footnote}</p>
				))}

				*/}
			</div>
		</>
	)
}

export default RequirementWindow
