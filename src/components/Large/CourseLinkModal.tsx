import { useState } from "react"
import { Block, Course } from "../../types/degreeTest"
import RequirementLinkBlock from "./RequirementLinkBlock"
import axios from "axios"
import { createDefaultBlock } from "../../utils/degreeParsing"

// Needs to be implemented properly
function getProgress() {
    return [1, 2, 3]
}

const requirementList: Block[] = [createDefaultBlock(), createDefaultBlock(), createDefaultBlock()]

function CourseLinkModal({course, close}: {course: Course, close(): void}) {

    // Create a util function for this b/c it does not account for xVxx courses
    const hours = parseInt(course.number[1])
    



    // All of this is only necessary if there is no "default" link
    // If a default link exists, we should do that instead

    const [appliedHours, setAppliedHours] = useState(0)


    // TODO: Generate the requirement list here


    // Need to have the number of hours set in each requirement for the submission
    const [hoursAllocation, setHoursAllocation] = useState([])


    // Need CourseID, RequirementID, and numHours for each requirement to be linked
    const linkRequirement = (courseID: string, reqID: string, hours: number) => {
        async () => {
            try {
                const response = await axios.put("http://localhost:3000/api/degreePlan/linkCourseToRequirementBlock", {
                    degreePlanCourseID: courseID,
                    blockID: reqID,
                    credit: hours,
                })
            } catch (error) {
                console.error("Error removing course: ", error)
            }
        }
    }

    // TODO: Pass more course information for the courseID
    const submitLink = () => {
        hoursAllocation
            .filter(hours => hours > 0)
            .map((hours, i) =>
                linkRequirement(course.id, requirementList[i].blockID, hours)
            )

        // Cleanup
        close()
    }

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
    

    // TODO: SET FOCUS ON THIS WINDOW
    return (
        <>
            <div className="flex flex-col items-center w-full border-2 rounded-lg p-4 gap-4">
                <div className="flex flex-row justify-between w-full gap-2">
                    <h1 className="h-8 text-xl max-w-100 line-clamp-1">{course.name}</h1>
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
                        onClick={() => {
                            console.log("Cancel Link")
                            close()
                        }}
                    >
                        Cancel
                    </button>

                    {/* Gray out when not all hours are linked */}
                    <button 
                        className={"flex flex-row justify-end w-fit border p-1 rounded-lg " + (isFull() && "bg-green-100")} 
                        onClick={() => {
                            console.log("Submit Link")
                            submitLink()
                        }} 
                        disabled={!isFull()}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </>
    )
}

export default CourseLinkModal