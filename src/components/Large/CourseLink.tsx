import { useContext, useState } from "react"
import { Block } from "../../types/degreeTest"
import RequirementLinkBlock from "./RequirementLinkBlock"
import { LinkContext } from "../../contexts/LinkContext"

// Needs to be implemented properly
function getProgress() {
    return [1, 2, 3]
}

function click(message: string, func: any) {
	console.log(message)
    if (func) {
        func()
    }
}

function CourseLink({name, hours, requirementList}: {name: string, hours: number, requirementList: Block[]}) {
    
    const [appliedHours, setAppliedHours] = useState(0)

    // Currently just reverts the mask
    // Needs to be implemented
    const linkContext = useContext(LinkContext)
    const cancelLink = linkContext?.cancelLink
    const submitLink = linkContext?.submitLink

    const applyHour = () => {
        if (appliedHours != hours) {
            setAppliedHours(appliedHours + 1)
            return true
        }
        return false
    }

    const removeHour = () => {
        if (appliedHours != 0) {
            setAppliedHours(appliedHours - 1)
            return true
        }
        return false
    }

    const isFull = () => {
        return hours == appliedHours
    }
    

    // SET FOCUS ON THIS WINDOW
    return (
        <>
            <div className="flex flex-col items-center w-full border-2 rounded-lg p-4 gap-4">
                <div className="flex flex-row justify-between w-full gap-2">
                    <h1 className="h-8 text-xl max-w-100 line-clamp-1">{name}</h1>
                    <p className="text-xl">
                        {appliedHours + "/" + hours}
                    </p>
                </div>
                <p className="text-lg">Matching Requirements</p>
                <hr className="w-full" />
                <div className="flex flex-col gap-4 w-full px-2">
                    {requirementList.map((requirement) => 
                        <RequirementLinkBlock name={requirement.blockName} progress={getProgress()} add={applyHour} remove={removeHour} full={isFull}></RequirementLinkBlock>
                    )}
                </div>
                <div className="flex flex-row justify-between w-full">
                    <button 
                        className="flex flex-row w-fit border bg-red-100 p-1 rounded-lg" 
                        onClick={() => {click("Cancel Link", cancelLink)}}
                    >
                        Cancel
                    </button>

                    {/* Gray out when not all hours are linked */}
                    <button 
                        className={"flex flex-row justify-end w-fit border p-1 rounded-lg " + (isFull() && "bg-green-100")} 
                        onClick={() => click("Submit Link", submitLink)} 
                        disabled={!isFull()}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </>
    )
}

export default CourseLink