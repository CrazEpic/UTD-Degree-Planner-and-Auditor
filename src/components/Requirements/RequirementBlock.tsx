import { Button, Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react"
import { ChevronDownIcon } from "@heroicons/react/24/solid"
import { Block, CourseBlock, FlagToggleBlock, MatcherGroupBlock, TextBlock } from "../../types/degreeTest"
import ProgressBar from "./ProgressBar"
import RequirementCourse from "./RequirementCourse"
import { useState } from "react"

function RequirementBlock({requirement, depth, checkbox}: {requirement: Block, depth: number, checkbox: boolean}) {
  
    // Extremely ugly, just testing understanding
    const [selected, setSelected] = useState(false)
    const handleClick = () => {
        setSelected(!selected)
    }
    const MyButton = () => {
        return (
            <button className={"size-[24px] border-2 rounded-[5px] hover:bg-green-200" + (selected ? " bg-[#154734]" : " bg-[#ffffff]")} onClick={handleClick}> </button>
        )
    }

    const borderStyle = "border rounded-[10px] items-center p-[8px] pr-0 " + (depth > 1 ? "border-r-0 rounded-r-none " : "") 

    const progress : number[] = [
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
                                /* 
                                Headless UI Button
                                Trying to understand how to use 
                                the data-active and data-hover props
                                <Button></Button> 
                                */  
                            ) : (
                                <div className="size-[24px]"></div>
                            )}
                        </div>
                    </div>
                    <DisclosurePanel className="flex flex-col gap-[12px] col-span-6">
                        {/* Conditions are not currently implemeneted */}
                        {/* Recursive Blocks */}
                        {requirement.innerBlocks.map((inner) =>
                            <>
                                {{  // Inline switch for the block types (Need to implement Text and FlagToggle)
                                'NonTerminal': <RequirementBlock requirement={inner} depth={depth + 1} checkbox={false}></RequirementBlock>,
                                'Course': <RequirementCourse course={inner.blockContent as CourseBlock} name={inner.blockName}></RequirementCourse>,
                                'Text': <p>{(inner.blockContent as TextBlock).text}</p>,
                                'MatcherGroup': <RequirementCourse course={inner.blockContent as CourseBlock} name={"Matcher"}></RequirementCourse>, // Probably doesn't work this way
                                'FlagToggle': <p>{(inner.blockContent as FlagToggleBlock).flagId}</p>,
                                } [inner.blockType] }
                            </>
                        )}
                    </DisclosurePanel>
                </Disclosure>
            </div>
        </>
    )
}

export default RequirementBlock