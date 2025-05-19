import { DisclosurePanel } from "@headlessui/react"
import InsertNonterminalButton from "./InsertNonterminalButton"
import InsertCourse from "./InsertCourse"
import InsertTextButton from "./InsertTextButton"
import SelectNonterminalConditions from "./SelectNonterminalConditions"
import SlideTransition from "../../../Shared/SlideTransition"
import DropTransition from "../../../Shared/DropTransition"
import { Block, NonTerminalBlock } from "../../../../types/block"

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

    const renderContent = () => {
        return (
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
        )   
    }

    return (
        <>
            <div className={"w-fit " + (transition && "overflow-hidden")}>
                <div className="block lg:hidden">
                    <DropTransition show={show}>
                        {renderContent()}
                    </DropTransition>
                </div>
                <div className="hidden lg:block">
                    <SlideTransition show={show}>
                        {renderContent()}
                    </SlideTransition>
                </div>
            </div>
        </>
    )
}

export default InsertPanel