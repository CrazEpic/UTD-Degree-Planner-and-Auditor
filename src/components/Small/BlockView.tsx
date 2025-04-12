import { Button, Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react"
import { ChevronDownIcon } from "@heroicons/react/24/solid"
import { Block, CourseBlock, FlagToggleBlock, MatcherGroupBlock, TextBlock } from "../../types/degreeTest"
import ProgressBar from "./Requirements/ProgressBar"
import CourseBlockView from "./CourseBlockView"
import { useState } from "react"

function BlockView({ requirement, depth, checkbox }: { requirement: Block; depth: number; checkbox: boolean }) {
	// Extremely ugly, just testing understanding
	const [selected, setSelected] = useState(false)
	const handleClick = () => {
		setSelected(!selected)
	}
	const MyButton = () => {
		return (
			<button className={"size-[24px] border-2 rounded-[5px] hover:bg-green-200" + (selected ? " bg-[#154734]" : " bg-[#ffffff]")} onClick={handleClick}>
				{" "}
			</button>
		)
	}

	const borderStyle = "border rounded-[10px] items-center p-[8px] pr-0 " + (depth > 1 ? "border-r-0 rounded-r-none " : "")

	const progress: number[] = [
		1, // getCompleted()
		2, // getPlanned()
		3, // getUnplanned()
	]

	return (
		<>
			<div className={borderStyle + (selected && " bg-orange-300 overflow-hidden")}>
				<Disclosure>
					<div className="flex flex-row items-center pr-[8px]">
						<div className="flex flex-row items-center gap-[8px]">
							<DisclosureButton className="group py-2">
								<ChevronDownIcon className="size-[24px]"></ChevronDownIcon>
							</DisclosureButton>

							{/* Text does not truncate or turn to ellipses*/}
							<p className="line-clamp-1 justify-self-start">{requirement.blockName}</p>
						</div>
						<div className="flex flex-row ml-auto items-center justify-self-end mr-[8px] gap-[8px]">
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
								<div className="size-[24px]"></div>
							)}
						</div>
					</div>
					<DisclosurePanel className="flex flex-col gap-[12px] col-span-6">
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
									return <BlockView requirement={inner} depth={depth + 1} checkbox={checkbox}></BlockView>
								case "Course":
									return <CourseBlockView course={inner.blockContent as CourseBlock} name={inner.blockName}></CourseBlockView>
								case "Text":
									return <p>{(inner.blockContent as TextBlock).text}</p>
								case "MatcherGroup":
									return <CourseBlockView course={inner.blockContent as CourseBlock} name={"Matcher"}></CourseBlockView>
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
