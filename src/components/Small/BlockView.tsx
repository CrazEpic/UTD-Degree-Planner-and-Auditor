import { Button, Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react"
import { ChevronDownIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline"
import { Block, CourseBlock, FlagToggleBlock, MatcherGroupBlock, TextBlock } from "../../types/degreeTest"
import ProgressBar from "./Requirements/ProgressBar"
import CourseBlockView from "./CourseBlockView"
import { useState } from "react"
import MatcherBlockView from "./MatcherBlockView"
import axios from "axios"
import CourseSearch from "../DegreeBuilding/CourseSearch"

function BlockView({
	requirement,
	depth,
	checkbox,
	fetchDegree,
	editMode,
}: {
	requirement: Block
	depth: number
	checkbox: boolean
	fetchDegree: Function
	editMode: boolean
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

	const InsertNonterminalBlockAtPositionButton = () => {
		return (
			<Button
				className="size-6 border-2 rounded-md hover:bg-green-200 w-min flex flex-row"
				onClick={async () => {
					try {
						await axios.post("http://localhost:3000/api/buildDegree/insertBlockAtPosition", {
							parentBlockID: requirement.parentBlockID,
							position: requirement.blockPosition,
							blockTypeInformation: {
								blockType: "NONTERMINAL",
							},
						})
						fetchDegree()
					} catch (error) {
						console.log(error)
					}
				}}
			>
				<PlusIcon className="min-w-6 min-h-6"></PlusIcon>
				<p className="text-nowrap">Insert Nonterminal Block</p>
			</Button>
		)
	}

	const InsertCourseAtPositionButton = () => {
		return (
			// <Button
			// 	className="size-6 border-2 rounded-md hover:bg-green-200 w-min flex flex-row"
			// 	onClick={async () => {
			// 		try {
			// 			await axios.post("http://localhost:3000/api/buildDegree/insertBlockAtPosition", {
			// 				parentBlockID: requirement.parentBlockID,
			// 				position: requirement.blockPosition,
			// 				blockTypeInformation: {
			// 					blockType: "COURSE",
			// 					prefix: "MATH",
			// 					number: "2417",
			// 				},
			// 			})
			// 			fetchDegree()
			// 		} catch (error) {
			// 			console.log(error)
			// 		}
			// 	}}
			// >
			// 	<PlusIcon className="min-w-6 min-h-6"></PlusIcon>
			// 	<p className="text-nowrap">Insert Course Block</p>
			// </Button>
			<CourseSearch parentBlockID={requirement.parentBlockID} blockPosition={requirement.blockPosition} fetchDegree={fetchDegree}></CourseSearch>
		)
	}

	const InsertTextAtPositionButton = () => {
		return (
			<Button
				className="size-6 border-2 rounded-md hover:bg-green-200 w-min flex flex-row"
				onClick={async () => {
					try {
						await axios.post("http://localhost:3000/api/buildDegree/insertBlockAtPosition", {
							parentBlockID: requirement.parentBlockID,
							position: requirement.blockPosition,
							blockTypeInformation: {
								blockType: "TEXT",
							},
						})
						fetchDegree()
					} catch (error) {
						console.log(error)
					}
				}}
			>
				<PlusIcon className="min-w-6 min-h-6"></PlusIcon>
				<p className="text-nowrap">Insert Text Block</p>
			</Button>
		)
	}

	const DeleteBlockButton = () => {
		return (
			<Button
				className="size-6 border-2 rounded-md hover:bg-red-200"
				onClick={async () => {
					try {
						await axios.delete("http://localhost:3000/api/buildDegree/deleteBlock", {
							data: {
								blockID: requirement.blockID,
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
		)
	}

	// // update block name
	// axios.put("http://localhost:3000/api/buildDegree/updateBlockName", {
	// 	data: {
	// 		blockID: requirement.blockID,
	// 		blockName: "",
	// 	},
	// })
	// axios.put("http://localhost:3000/api/buildDegree/updateTextBlock", {
	// 	data: {
	// 		blockID: requirement.blockContent.id,
	// 		text: "",
	// 	},
	// })
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
				{editMode && (
					<>
						<div className="flex flex-row gap-2">
							<InsertNonterminalBlockAtPositionButton></InsertNonterminalBlockAtPositionButton>
							<InsertCourseAtPositionButton></InsertCourseAtPositionButton>
							<InsertTextAtPositionButton></InsertTextAtPositionButton>
						</div>
					</>
				)}
				<Disclosure defaultOpen={editMode}>
					<div className="flex flex-row items-center pr-2">
						<div className="flex flex-row items-center gap-2">
							<DisclosureButton className="group py-2">
								<ChevronDownIcon className="size-6 max-lg:size-8"></ChevronDownIcon>
							</DisclosureButton>

							{/* Text does not truncate or turn to ellipses*/}
							<p className="line-clamp-1 justify-self-start">{requirement.blockName}</p>
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
							{editMode && <DeleteBlockButton></DeleteBlockButton>}
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
										<BlockView
											requirement={inner}
											depth={depth + 1}
											checkbox={checkbox}
											fetchDegree={fetchDegree}
											editMode={editMode}
										></BlockView>
									)
								case "Course":
									return (
										<div className="flex flex-row w-full">
											<CourseBlockView course={inner.blockContent as CourseBlock} name={inner.blockName} indent={true}></CourseBlockView>
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
												<TrashIcon className="min-w-6 min-h-6"></TrashIcon>
											</Button>
										</div>
									)
								case "Text":
									return <p>{(inner.blockContent as TextBlock).text}</p>
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
