import { Button, Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react"
import { ChevronDownIcon } from "@heroicons/react/24/solid"
import { Block, CourseBlock, FlagToggleBlock, MatcherGroupBlock, TextBlock } from "../../types/degreeTest"
import ProgressBar from "./Requirements/ProgressBar"
import CourseBlockView from "./CourseBlockView"
import { useState } from "react"
import MatcherBlockView from "./MatcherBlockView"

function BlockView({ requirement, depth, checkbox }: { requirement: Block; depth: number; checkbox: boolean }) {
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

	return (
		<>
			<div className={borderStyle + (selected && " bg-orange-300 overflow-hidden")}>
				<Disclosure>
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
						</div>
					</div>
					<DisclosurePanel className="flex flex-col gap-3 col-span-6">
						{/* Conditions are not currently implemeneted */}
						{/* Recursive Blocks */}
						{requirement.innerBlocks.map((inner) => {
							switch (inner.blockType) {
								case "NonTerminal":
									return <BlockView requirement={inner} depth={depth + 1} checkbox={checkbox}></BlockView>
								case "Course":
									return <CourseBlockView course={inner.blockContent as CourseBlock} name={inner.blockName} indent={true}></CourseBlockView>
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
