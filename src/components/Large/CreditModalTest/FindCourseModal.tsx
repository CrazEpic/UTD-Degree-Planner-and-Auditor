import { Dispatch, SetStateAction, useContext } from "react"
import { Course, DegreePlan, DegreePlanCourse } from "../../../types/degreeTest"
import PlannerCourse from "../Planner/PlannerCourse"
import { UserContext } from "../../../contexts/UserContext"
import { ChevronLeftIcon } from "@heroicons/react/24/outline"
import CourseBlockView from "../../BlockViews/CourseBlockView"

const createDefaultCourse = () : Course =>  {
    return {
        prefix: "CR",
        number: "1234",
        name: "Course Name",
    }
}

const FindCourseModal = ({ type, back, closeModal } : { type: string, back: Dispatch<SetStateAction<null>>, closeModal(): void }) => {

    const plan = useContext(UserContext)?.user?.DegreePlan

    const createDegreePlanCourse = () : DegreePlanCourse => {
        return {
            degreePlanCourseID: "",
            degreePlanID: "",
            DegreePlan: (plan as DegreePlan),
            Course: createDefaultCourse(),
            prefix: "CR",
            number: "1234",
        }
    }

    const degreePlanCourses : DegreePlanCourse[] = [
        createDegreePlanCourse(),
        createDegreePlanCourse(),
        createDegreePlanCourse(),
        createDegreePlanCourse(),
    ]

    // Should be replaced with course selection confirmation
    const isComplete = () : boolean => {
        return false
    }

    // Course selection for a particular credit
    return (
        <>
            <div className="flex flex-col items-center w-full border-2 rounded-lg p-4 gap-4 min-w-80">
                <h1 className="h-8 text-xl max-w-100 line-clamp-1">Matching Courses</h1>
                <hr className="w-full" />
                <div className="flex flex-col gap-4 w-full px-2">

                    {/* TODO: Make the courses selectable */}
                    {degreePlanCourses.length > 0 &&

                        // TODO: Accurately display this information
                        <>
                            {degreePlanCourses.map((course) => {
                                <>
                                    
                                    <PlannerCourse course={course}></PlannerCourse>
                                    <CourseBlockView course={{id: "", prefix: "", number: ""}} name={""} indent={false} mode={"VIEW"}></CourseBlockView>
                                </>
                            })}
                        </>
                    }
                    <PlannerCourse course={createDegreePlanCourse()}></PlannerCourse>
                    <CourseBlockView course={{id: "", prefix: "", number: ""}} name={""} indent={false} mode={"VIEW"}></CourseBlockView>
                </div>
                <div className="flex flex-row justify-between w-full">
                    <button
                        className="flex flex-row w-fit border bg-red-100 p-1 rounded-lg"
                        onClick={() => {
                            console.log("Back to credit")
                            back(null)
                        }}
                    >
                        <ChevronLeftIcon className="size-6 max-lg:size-8"></ChevronLeftIcon>
                        Back
                    </button>

                    {/* Gray out when not all hours are linked */}
                    <button
                        className={"flex flex-row justify-end w-fit border p-1 rounded-lg " + (isComplete() && "bg-green-100")}
                        onClick={() => {
                            console.log("Submit Credit")
                            if (type === "Transfer") {
                                // Update the degree plan with API
                                closeModal()
                            }
                            else {
                                // Update the degree plan with API
                                closeModal()
                            }
                        }}
                        disabled={!isComplete()}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </>
    )
}

export default FindCourseModal