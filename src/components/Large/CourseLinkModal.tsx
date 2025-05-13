import { useContext, useState } from "react"
import { Course } from "../../types/degree"
import RequirementLinkBlock from "./RequirementLinkBlock"
import axios from "axios"
import { createDefaultBlock } from "../../utils/degreeParsing"
import { UserContext } from "../../contexts/UserContext"
import { Block } from "../../types/block"

// TODO: Implement progress updates
function getProgress() {
    return [1, 2, 3]
}

const parseRequirements = (data: any) : Block[] => {
    console.log(data)
    return []
}

const requirementList: Block[] = [createDefaultBlock(1), createDefaultBlock(2), createDefaultBlock(3)]

function CourseLinkModal({course, close}: {course: Course, close(): void}) {

    // TODO: Create a util function for this b/c it does not account for xVxx courses
    const hours = parseInt(course.number[1])

    // TODO: Find a default link, and then show that instead.
    

    // All of this is only necessary if there is no "default" link
    // If a default link exists, we should do that instead

    const planID = useContext(UserContext)?.user?.DegreePlan?.degreePlanID

    // TODO: Actually return requirements
    const getRequirements = (planID: string) : Block[] => {
        let requirements : Block[] = []
        async () => {
            try {
                const response = await axios.put("/api/degreePlan/getAllCourseToRequirementBlockLinks", {
                    degreePlanID: planID,
                })
                requirements = parseRequirements(response)
            } catch (error) {
                console.error("Error getting matching requirements: ", error)
            }
        }

        return requirements
    }

    // Holds the allocation of hours for each requirement in reqList
    const reqList = getRequirements(planID as string)
    const [hoursAllocation, setHoursAllocation] = useState(new Array(reqList.length).fill(0))

    const appliedHours = hoursAllocation.reduce((sum, val) => sum + val, 0)

    // Need CourseID, RequirementID, and numHours for each requirement to be linked
    const linkRequirement = (courseID: string, reqID: string, hours: number) => {
        console.log("Attempt to link course " + courseID + " with requirement " + reqID + " for " + hours + " hours.")
        async () => {
            try {
                const response = await axios.put("/api/degreePlan/linkCourseToRequirementBlock", {
                    degreePlanCourseID: courseID,
                    blockID: reqID,
                    credit: hours,
                })
            } catch (error) {
                console.error("Error linking course: ", error)
            }
        }
    }

    const submitLink = () => {
        hoursAllocation
            .filter(hours => hours > 0)
            .map((hours, i) =>
                linkRequirement(course.id, reqList[i].blockID, hours)
            )

        // Cleanup
        close()
    }

    const applyHour = (id: string) => {
        if (appliedHours != hours) {
            const index = reqList.findIndex((req) => req.blockID === id)
            const newHours = hoursAllocation.map((hours, i) => {
                if (i === index) {
                    return hours + 1
                }
                return hours
            })
            setHoursAllocation(newHours)
            return true
        }
        return false
    }

    const removeHour = (id: string) => {
        if (appliedHours != 0) {
            hoursAllocation[reqList.findIndex((req) => req.blockID === id)] -= 1
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
                    {reqList.length > 0 ? (
                        <>
                            {reqList.map((requirement) => 
                                <RequirementLinkBlock req={requirement} progress={getProgress()} add={applyHour} remove={removeHour} full={isFull}></RequirementLinkBlock>
                            )}
                        </>
                    ) : (
                        <>
                            <p>Requirement list is empty</p>
                            {requirementList.map((requirement) => 
                                <RequirementLinkBlock req={requirement} progress={getProgress()} add={applyHour} remove={removeHour} full={isFull}></RequirementLinkBlock>
                            )}
                        </>
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