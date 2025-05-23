import { useContext, useState } from "react"
import axios from "axios"
import { ChevronLeftIcon } from "@heroicons/react/24/outline"
import EquivalentCourseView from "./EquivalentCourseView"
import { CoursesContext } from "../../../../contexts/CoursesContext"
import { UserContext } from "../../../../contexts/UserContext"
import { getEquivalentCourses } from "../../../../utils/credit"
import { Credit } from "../../../../types/testAndTransferTypes"
import { Course } from "../../../../types/degree"

const FindCourseModal = ({ 
    type,
    credit,
    back,
    closeModal
} : { 
    type: string,
    credit: Credit,
    back: Function,
    closeModal(): void
}) => {

    const user = useContext(UserContext)?.user

    const allCourses = useContext(CoursesContext)?.courses

    // Fetch the applicable courses from the equivalency??
    const equivalentCourses = getEquivalentCourses(allCourses as Course[], credit.equivalency)

    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)

    const update = (action: string, coursePrefix: string, courseNumber: string) => {
        if (action === "ADD") {
            const course = equivalentCourses.find(course => course.prefix === coursePrefix && course.number === courseNumber)
            if (course) {
                setSelectedCourse(course)
            }
            else {
                console.log("Course not found in equivalent list")
            }
        }
        else {
            setSelectedCourse(null)
        }
    }

    const isComplete = () : boolean => {return !!selectedCourse}

    // TODO: modify styling or something to display error
    const failed = () => {
        // Something went wrong with applying the credit
        console.log("Failed to do something")
        console.log("Modify the styling to display the error")
    }

    const addCredit = async ()  => {
        let response = null
        if (type === "Transfer") {
            try {
                response = await axios.post("/api/degreePlan/addTransferCredit", {
                    userID: user?.userID,
                    transferCourseEquivalencyID: credit.id,
                })
                console.log(response.data)
            } catch (error) {
                console.error("Could not add transfer credit")
                failed()
            }
            try {
                response = await axios.post("/api/degreePlan/applyTransferCredit", {
                    userID: user?.userID as string,
                    degreePlanID: user?.DegreePlan?.degreePlanID  as string,
                    prefix: selectedCourse?.prefix  as string,
                    number: selectedCourse?.number  as string,
                    transferCourseEquivalencyID: credit.id  as string,
                })
                console.log(response.data)
            } catch (error) {
                console.error("Could not apply transfer credit")
                failed()
            }
        }

        // Implement applying test credits
        else {
            try {
                response = await axios.post("/api/degreePlan/addTestCredit", {
                    userID: user?.userID,
                    testComponentID: credit.id,
                    testScore: credit.score
                })
                console.log(response.data)
            } catch (error) {
                console.error("Could not add test credit")
                failed()
            }
            try {
                response = await axios.post("/api/degreePlan/applyTestCredit", {
                    userID: user?.userID as string,
                    degreePlanID: user?.DegreePlan?.degreePlanID  as string,
                    prefix: selectedCourse?.prefix  as string,
                    number: selectedCourse?.number  as string,
                    testComponentID: credit.id  as string,
                })
                console.log(response.data)
            } catch (error) {
                console.error("Could not apply test credit")
                failed()
            }
        }
        closeModal()
    }

    return (
        <>
            <div className="flex flex-col items-center w-full border-2 rounded-lg p-4 gap-4 min-w-80">
                <h1 className="h-8 text-xl max-w-100 line-clamp-1">Matching Courses</h1>
                <hr className="w-full" />
                <div className="flex flex-col gap-4 w-full px-2">
                    {equivalentCourses.length > 0 ? (
                        <>
                            {equivalentCourses.map((course) =>
                                <EquivalentCourseView course={course} selected={!!(selectedCourse?.prefix === course.prefix && selectedCourse?.number === course.number)} updateCourse={update}></EquivalentCourseView>
                            )}
                        </>
                    ) : (
                        <p>No applicable courses were found</p>
                    )}
                </div>

                {/* TODO: Restyle these buttons */}
                <div className="flex flex-row justify-between w-full">
                    <button
                        className="flex flex-row items-center w-fit border bg-red-100 pr-1 rounded-lg"
                        onClick={() => {
                            console.log("Back to credit")
                            back({
                                id: "",
                                equivalency: "",
                            })
                        }}
                    >
                        <ChevronLeftIcon className="size-8"></ChevronLeftIcon>
                        Back
                    </button>

                    {/* Gray out when not all hours are linked */}
                    <button
                        className={"flex flex-row justify-end w-fit border p-1 rounded-lg " + (isComplete() && "bg-green-100")}
                        onClick={() => {
                            console.log("Submit Credit")
                            addCredit()
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