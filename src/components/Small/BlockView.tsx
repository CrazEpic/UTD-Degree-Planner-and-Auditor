import { Button, Disclosure, DisclosureButton, DisclosurePanel, Input } from "@headlessui/react"
import { ChevronDownIcon, TrashIcon } from "@heroicons/react/24/outline"
import { Block, CourseBlock, FlagToggleBlock, MatcherGroupBlock, TextBlock } from "../../types/degreeTest"
import ProgressBar from "./Requirements/ProgressBar"
import CourseBlockView from "./CourseBlockView"
import { useState } from "react"
import MatcherBlockView from "./MatcherBlockView"
import axios from "axios"
import DeleteBlockButton from "../DegreeBuilding/DegreeFunctionality/DeleteBlockButton"
import InsertNonterminalButton from "../DegreeBuilding/DegreeFunctionality/InsertNonterminalButton"
import InsertTextButton from "../DegreeBuilding/DegreeFunctionality/InsertTextButton"
import InsertCourse from "../DegreeBuilding/DegreeFunctionality/InsertCourse"
import TextBlockView from "./TextBlockView"
import { Mode } from "../../types/requirementWindow"

function BlockView({
	requirement,
	depth,
	checkbox,
	fetchDegree,
	mode,
}: {
	requirement: Block
	depth: number
	checkbox: boolean
	fetchDegree: Function
	mode: Mode
}) {
	// Extremely ugly, just testing understanding
	const [selected, setSelected] = useState(false)
	const handleClick = () => {
		setSelected(!selected)
	}
	const MyButton = () => {
		return (
			<button className={"size-6 border-2 rounded-md hover:bg-green-200" + (selected ? " bg-[#154734]" : " bg-[#ffffff]")} onClick={handleClick}>
				{" "}
			</button>
		)
	}

	const borderStyle = "border rounded-lg items-center p-2 pr-0 " + (depth > 1 ? "border-r-0 rounded-r-none " : "")

	const progress: number[] = [
		1, // getCompleted()
		2, // getPlanned()
		3, // getUnplanned()
	]

	// DEGREE BUILDING STUFF
	// I DON'T KNOW IF I SHOULD PUT THESE IN A SEPARATE COMPONENT FILE
	// insert nonterminal

	// only nonterminal blocks can have inner blocks for now

	// axios.put("http://localhost:3000/api/buildDegree/updateNonterminalBlockCondition", {
	// 	data: {
	// 		blockID: requirement.blockContent.id,
	// 		conditions: {
	// 			blockFulfillmentCondition: {
	// 				blocksToFulfill: 1,
	// 			},
	// 			minBlockInclusionCondition: {
	// 				minBlocksToInclude: 1,
	// 			},
	// 			creditHourCondition: {
	// 				minCreditHours: 1,
	// 			},
	// 			levelCondition: {
	// 				creditHourRequirement: 1,
	// 				level: "4000",
	// 			},
	// 			hourBeyondBlockCondition: {
	// 				blockKey: "",
	// 				hoursBeyondBlock: 1,
	// 			},
	// 		},
	// 	},
	// })

	return (
		<>
			<div className={borderStyle + (selected && " bg-orange-300 overflow-hidden")}>
				{mode === "EDIT" && (
					<>
						<div className="flex flex-row gap-2">
							<InsertNonterminalButton
								blockID={requirement.blockID}
								insertPosition={
									requirement.innerBlocks.length != 0 ? requirement.innerBlocks[requirement.innerBlocks.length - 1].blockPosition + 1 : 0
								}
								fetchDegree={fetchDegree}
							/>
							<InsertCourse
								blockID={requirement.blockID}
								insertPosition={
									requirement.innerBlocks.length != 0 ? requirement.innerBlocks[requirement.innerBlocks.length - 1].blockPosition + 1 : 0
								}
								fetchDegree={fetchDegree}
							/>
							<InsertTextButton
								blockID={requirement.blockID}
								insertPosition={
									requirement.innerBlocks.length != 0 ? requirement.innerBlocks[requirement.innerBlocks.length - 1].blockPosition + 1 : 0
								}
								fetchDegree={fetchDegree}
							/>
						</div>
					</>
				)}
				<Disclosure defaultOpen={mode === "EDIT"}>
					<div className="flex flex-row items-center pr-2">
						<div className="flex flex-row items-center gap-2">
							<DisclosureButton className="group py-2">
								<ChevronDownIcon className="size-6 max-lg:size-8"></ChevronDownIcon>
							</DisclosureButton>

							{/* Text does not truncate or turn to ellipses*/}
							{/* block name */}
							{mode === "EDIT" ? (
								<form
									method="post"
									onSubmit={async (event) => {
										event.preventDefault()
										const form = event.target as HTMLFormElement
										const formData = new FormData(form)
										const blockName = formData.get("blockName") as string
										try {
											axios.put("http://localhost:3000/api/buildDegree/updateBlockName", {
												blockID: requirement.blockID,
												blockName: blockName,
											})
											fetchDegree()
										} catch (error) {
											console.log(error)
										}
									}}
								>
									<label>
										<Input
											name="blockName"
											placeholder="Enter new block name"
											type="text"
											defaultValue={requirement.blockName}
											className={"border-2 border-black"}
										/>
									</label>
								</form>
							) : (
								<p className="line-clamp-1 justify-self-start">{requirement.blockName}</p>
							)}
						</div>
						<div className="flex flex-row ml-auto items-center justify-self-end mr-2 gap-2">
							<ProgressBar progress={progress}></ProgressBar>
							{checkbox ? (
								<MyButton></MyButton>
							) : (
								/* 
                                Headless UI Button
                                Trying to understand how to use 
                                the data-active and data-hover props
                                <Button></Button> 
                                */
								<div className="size-6"></div>
							)}
							{mode === "EDIT" && <DeleteBlockButton blockID={requirement.blockID} fetchDegree={fetchDegree} />}
						</div>
					</div>
					<DisclosurePanel className="flex flex-col gap-3 col-span-6">
						{requirement.blockType === "NonTerminal" &&
							Object.keys(requirement.blockContent.conditions)
								.filter((key) => {
									return key != "id"
								})
								.map((condition) => {
									let message
									switch (condition) {
										case "blockFulfillmentCondition":
											message = "Blocks to Fulfill: " + requirement.blockContent.conditions[condition].blocksToFulfill
											break
										case "minBlockInclusionCondition":
											message = "Minimum Blocks to Include: " + requirement.blockContent.conditions[condition].minBlocksToInclude
											break
										case "creditHourCondition":
											message = "Minimum Credit Hours: " + requirement.blockContent.conditions[condition].minCreditHours
											break
										case "levelCondition":
											message =
												"Level Condition: " +
												requirement.blockContent.conditions[condition].creditHourRequirement +
												" hours must be " +
												requirement.blockContent.conditions[condition].level
											break
										case "hourBeyondBlockCondition":
											message = "Hours Beyond Block: " + requirement.blockContent.conditions[condition].hoursBeyondBlock
											break
									}
									return <p>{message}</p>
								})}
						{/* Conditions are not currently implemeneted */}
						{/* Recursive Blocks */}
						{requirement.innerBlocks.map((inner) => {
							switch (inner.blockType) {
								case "NonTerminal":
									return (
										<BlockView requirement={inner} depth={depth + 1} checkbox={checkbox} fetchDegree={fetchDegree} mode={mode}></BlockView>
									)
								case "Course":
									return (
										<div className="flex flex-row w-full">
											<CourseBlockView course={inner.blockContent as CourseBlock} name={inner.blockName} indent={true}></CourseBlockView>
											{/* FIX THIS LATER PLEASE */}
											{mode === "EDIT" && (
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
													<TrashIcon className="min-w-6 min-h-6"></TrashIcon>
												</Button>
											)}
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
											{/* FIX THIS LATER PLEASE */}
											{mode === "EDIT" && (
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
													<TrashIcon className="min-w-6 min-h-6"></TrashIcon>
												</Button>
											)}
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
					</DisclosurePanel>
				</Disclosure>
			</div>
		</>
	)
}

export default BlockView
