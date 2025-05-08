import { DisclosurePanel } from "@headlessui/react"
import InsertNonterminalButton from "./InsertNonterminalButton"
import InsertCourse from "./InsertCourse"
import { Block, NonTerminalBlock } from "../../../types/degreeTest"
import InsertTextButton from "./InsertTextButton"
import SelectNonterminalConditions from "./SelectNonterminalConditions"
import SlideTransition from "../../Shared/SlideTransition"

const InsertPanel = ({
    show,
    requirement, 
    transition, 
    fetchDegree
}: {
    show: boolean
    requirement: Block, 
    transition: boolean,
    fetchDegree: Function
}) => {
    return (
        <>
            <div className={"w-fit " + (transition && "overflow-hidden")}>
                <SlideTransition show={show}>
                    <DisclosurePanel
                        className="flex lg:flex-row max-lg:flex-col gap-2 lg:items-center max-lg:w-60"
                    >
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
                            transitioning={transition}
                        />
                        <InsertTextButton
                            blockID={requirement.blockID}
                            insertPosition={
                                requirement.innerBlocks.length != 0 ? requirement.innerBlocks[requirement.innerBlocks.length - 1].blockPosition + 1 : 0
                            }
                            fetchDegree={fetchDegree}
                        />
                        <SelectNonterminalConditions
                            nonterminalBlockID={requirement.blockContent.id}
                            conditions={(requirement.blockContent as NonTerminalBlock).conditions}
                            fetchDegree={fetchDegree}
                        />
                    </DisclosurePanel>
                </SlideTransition>
            </div>
        </>
        

        
    )
}

export default InsertPanel