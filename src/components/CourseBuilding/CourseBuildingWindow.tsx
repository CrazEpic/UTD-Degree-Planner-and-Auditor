import { Combobox, ComboboxOptions, ComboboxOption, ComboboxInput, Input, Switch } from "@headlessui/react"
import { useState, useEffect, useContext } from "react"
import { Course } from "../../types/degreeTest"
import { UserContext } from "../../contexts/UserContext"
import BuildCourse from "./BuildCourse"
import { CoursesContext } from "../../contexts/CoursesContext"
import axios from "axios"
import { courseSearchSort } from "../../utils/course"



const CourseBuildingWindow = () => {

    // Courses
    const courseContext = useContext(CoursesContext)
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
    const [courseQuery, setCourseQuery] = useState("")

    // Add new courses
    const [addDegreeVisible, setAddDegreeVisible] = useState(false)

    const addNewCourse = async (name: string, prefix: string, number: string) => {
        try {
            axios.put("http://localhost:3000/api/buildCourse/course", {
                prefix: prefix,
                number: number,
                name: name,
            })
            courseContext?.fetchCourses()
        } catch (error) {
            console.log("Failed to add course to courses", error)
        }
    }

    const renderCourses = (courseList: Course[]) => {
        return courseList
            .filter((course) => {
                return `${course.prefix} ${course.number} ${course.name}`.toLowerCase().includes(courseQuery.toLowerCase().trimEnd())
            })
            .sort((a, b) => courseSearchSort(a, b, courseQuery))
            .slice(0, 100)
            .map((course) => {
                return (
                    <ComboboxOption
                        key={course.id}
                        value={course}
                        className="hover:bg-gray-200 cursor-pointer px-2 rounded-md"
                    >
                        {course.prefix + " " + course.number + " " + course.name}
                    </ComboboxOption>
                )
            })
    }

    // TODO: Add API Call
    const updateCourses = (id:string, field: string, value: string) => {
        // API call
    }

    // Template code
    const plan = useContext(UserContext)?.user?.DegreePlan

    // Copied over from degree building window
    useEffect(() => {
        // fetchYears()
        // fetchCourses()
    }, [selectedCourse])

    return (
        <>
            <div className="flex flex-col gap-2 p-4">
                <div className="flex lg:flex-row max-lg:flex-col gap-2 justify-between w-full">

                    {/* Course selection */}
                    <Combobox
                        value={selectedCourse}
                        onChange={(value) => {
                            if (value) {
                                setSelectedCourse(value)
                            }
                        }}
                        by={(courseA, courseB) => {
                            return courseA?.name === courseB?.name
                        }}
                    >
                        <div>
                            <ComboboxInput
                                onChange={(event) => {
                                    setCourseQuery(event.target.value)
                                }}
                                displayValue={(course: Course | null) => {
                                    if (course === null) {
                                        return ""
                                    }
                                    return course.prefix + " " + course.number + " " + course.name
                                }}
                                placeholder="Search for a course"
                                className="border-2 border-black rounded-md p-2 h-10 mb-1"
                            ></ComboboxInput>
                            <ComboboxOptions static className="border-black border-2 rounded-md min-w-50 w-fit h-50 overflow-y-auto empty:invisible">

                                {/* TODO: Replace with actual state once its integrated */}
                                {renderCourses(courseContext?.courses as Course[])}
                            </ComboboxOptions>
                        </div>
                    </Combobox>

                    {/* Course addition */}
                    <div className="flex flex-col gap-2 lg:items-end h-fit">
                        <div className="flex flex-col items-center w-fit">
                            <p className=" w-30">Add New Course</p>
                            <Switch
                                checked={addDegreeVisible}
                                onChange={setAddDegreeVisible}
                                className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition data-[checked]:bg-blue-600"
                            >
                                <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6" />
                            </Switch>
                        </div>
                        {addDegreeVisible && (
                            <form
                                method="post"
                                onSubmit={async (event) => {
                                    event.preventDefault()
                                    const form = event.target as HTMLFormElement
                                    const formData = new FormData(form)
                                    const name = formData.get("name") as string
                                    const prefix = formData.get("prefix") as string
                                    const number = formData.get("number") as string
                                    addNewCourse(name, prefix, number)
                                    setAddDegreeVisible(false)
                                }}
                                className="flex flex-col gap-2 w-fit"
                            >
                                <label>
                                    <Input
                                        name="prefix"
                                        placeholder="Enter course prefix"
                                        type="text"
                                        className={"border-2 border-black rounded-md px-2 h-10 w-50"}
                                    ></Input>
                                </label>
                                <label>
                                    <Input
                                        name="number"
                                        placeholder="Enter course number"
                                        type="text"
                                        className={"border-2 border-black rounded-md px-2 h-10 w-50"}
                                    ></Input>
                                </label>
                                <label>
                                    <Input 
                                        name="name" 
                                        placeholder="Enter course name" 
                                        type="text" 
                                        className={"border-2 border-black rounded-md px-2 h-10"}></Input>
                                </label>
                                <button type="submit" name="submit" value="Submit" className="border border-black rounded-md w-full">
                                    <p>Add Course</p>
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Course building */}
                {selectedCourse !== null ? (
                    <BuildCourse key={selectedCourse.id} course={selectedCourse} update={updateCourses}></BuildCourse>
                ) : (
                    <div className="flex flex-col gap-2 max-lg:mt-4">
                        {selectedCourse === null && <p>Please select a course</p>}
                    </div>
                )}
            </div>
        </>
    )
}

export default CourseBuildingWindow