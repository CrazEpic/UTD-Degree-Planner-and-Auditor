import { Button, Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react"
import { ChevronDownIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/solid"
import { Block, CourseBlock, FlagToggleBlock, MatcherGroupBlock, TextBlock } from "../../types/degreeTest"
import ProgressBar from "../Small/Requirements/ProgressBar"
import CourseBlockView from "../Small/CourseBlockView"

function RequirementLinkBlock({name, progress}: {name: string, progress: number[]}) {

    return (
        <>
            <div className="border rounded-[10px] items-center p-2 w-full">
                <div className="flex flex-row justify-between items-center">
                    {/* Text does not truncate or turn to ellipses*/}
                    <p className="line-clamp-1 justify-self-start">{name}</p>
                    <div className="flex flex-row ml-auto justify-self-end gap-2">
                        <ProgressBar progress={progress}></ProgressBar>
                        <div className="flex flex-col gap-1">
                            <button className="size-4 border rounded-sm">
                                <PlusIcon></PlusIcon>
                            </button>
                            <button className="size-4 border rounded-sm">
                                <MinusIcon></MinusIcon>
                            </button>
                        </div>
                    </div>
                </div>
                {/* Disclosure Panel */}
            </div>
        </>
    )
}

export default RequirementLinkBlock