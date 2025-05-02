import { Dispatch, SetStateAction, useContext, useState } from "react"
import { Course, DegreePlan, DegreePlanCourse } from "../../../types/degreeTest"
import { UserContext } from "../../../contexts/UserContext"
import { ChevronLeftIcon } from "@heroicons/react/24/outline"
import MatchingCourseView from "./MatchingCourseView"

let count = 0

const createDefaultCourse = () : Course =>  {
    count += 1

    return {
        id: count.toString(),
        prefix: "CR",
        number: "1234",
        name: "Course Name",
    }
}

const FindCourseModal = ({ type, back, closeModal } : { type: string, back: Dispatch<SetStateAction<null>>, closeModal(): void }) => {

    const plan = useContext(UserContext)?.user?.DegreePlan

    // Template courses for modal
    let count = 0;
    const createDegreePlanCourse = () : DegreePlanCourse => {
        count += 1

        return {
            degreePlanCourseID: count.toString(),
            degreePlanID: (plan?.degreePlanID as string),
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

    const [selectedCourse, setSelectedCourse] = useState<DegreePlanCourse | null>(null)

    const update = (action: string, courseID: string) => {
        if (action === "ADD") {
            try {
                setSelectedCourse(
                    degreePlanCourses.find(course => course.degreePlanCourseID === courseID),
                )
            } catch (error) {
                console.error("Course not found in course list")
            }
        }
        else {
            setSelectedCourse(null)
        }
    }

    // Check to see if equivalency is valid
    // may change the courses to requirement blocks -> 2 courses for equivalence
    // example: AP: BC Calculus -> 2 different calculus courses
    const isComplete = () : boolean => {
        return !!selectedCourse
    }


    return (
        <>
            <div className="flex flex-col items-center w-full border-2 rounded-lg p-4 gap-4 min-w-80">
                <h1 className="h-8 text-xl max-w-100 line-clamp-1">Matching Courses</h1>
                <hr className="w-full" />
                <div className="flex flex-col gap-4 w-full px-2">

                    {degreePlanCourses.length > 0 &&
                        <>
                            {degreePlanCourses.map((course) =>
                                <>
                                    <MatchingCourseView course={{id: course.degreePlanCourseID, number: course.number, prefix: course.prefix}} name={"Course"} selected={!!(selectedCourse?.degreePlanCourseID === course.degreePlanCourseID)} updateCourse={update}></MatchingCourseView>
                                </>
                            )}
                        </>
                        
                    }
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