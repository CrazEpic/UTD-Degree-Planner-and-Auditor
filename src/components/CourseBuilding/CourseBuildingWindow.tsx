import { Combobox, ComboboxOptions, ComboboxOption, ComboboxInput, Input, Switch } from "@headlessui/react"
import { useState, useEffect, useContext } from "react"
import { Course, CourseBlock } from "../../types/degreeTest"
import { UserContext } from "../../contexts/UserContext"
import BuildCourse from "./BuildCourse"

// Remove template code once integrated
let id = 0
let num = 1300

const createDefaultCourseBlock = () => {
    id += 1
    num += Math.ceil(Math.random() * 7)

    return {
        id: id.toString(),
        Block: {
            blockID: id.toString(),
            blockName: "Course Name",
            InnerBlocks: [],
            blockPosition: 0,
        },
        Course: {
            id: id.toString(),
            prefix: "CS",
            number: num.toString(),
            name: "Course Name",
        },
        prefix: "CS",
        number: num.toString(),
    }
}

const createCourseBlock = (course: Course) => {
    return {
        id: course.id,
        Block: {
            blockID: course.id,
            blockName: course.name,
            InnerBlocks: [],
            blockPosition: 0,
        },
        Course: course,
        prefix: course.prefix,
        number: course.number,
    }
}

const updateCourse = (course: Course, field: string, value: string) : CourseBlock => {
    const newCourse = createCourseBlock(course)

    switch (field) {
        case "prefix":
            newCourse.Course.prefix = value
            newCourse.prefix = value
            break
        case "name":
            newCourse.Course.name = value
            break
        case "number":
            newCourse.Course.number = value
            newCourse.number = value
            break
        default:
            console.log("Wrong field")
    }
    return newCourse
}

const years = [2024, 2025]

const CourseBuildingWindow = () => {

    // Template course lists
    const [courses24, setCourses24] = useState<CourseBlock[]>([
        createDefaultCourseBlock(),
        createDefaultCourseBlock(),
        createDefaultCourseBlock(),
        createDefaultCourseBlock(),
        createDefaultCourseBlock(),
        createDefaultCourseBlock(),
        createDefaultCourseBlock(),
        createDefaultCourseBlock(),
        createDefaultCourseBlock(),
    ])

    const [courses25, setCourses25] = useState<CourseBlock[]>([
        createDefaultCourseBlock(),
        createDefaultCourseBlock(),
        createDefaultCourseBlock(),
        createDefaultCourseBlock(),
        createDefaultCourseBlock(),
        createDefaultCourseBlock(),
        createDefaultCourseBlock(),
        createDefaultCourseBlock(),
        createDefaultCourseBlock(),
    ])


    // Could create an object for all of these states rather than having 7 of them
    // Years
    const [catalogueYears, setCatalogueYears] = useState<number[]>([])
    const [selectedYear, setSelectedYear] = useState(0)
    const [yearQuery, setYearQuery] = useState("")

    // Courses
    const [catalogueCourses, setCatalogueCourses] = useState<CourseBlock[]>([])
    const [selectedCourse, setSelectedCourse] = useState<CourseBlock | null>(null)
    const [courseQuery, setCourseQuery] = useState("")

    // Add new courses
    const [addDegreeVisible, setAddDegreeVisible] = useState(false)
    

    // TODO: Implement API call to gather catalogue years
    const fetchYears = async () => {
        try {
            // const response = await axios.get("Some route")
            // setCatalogueYears(response.data)
        } catch (error) {
            console.error("Failed to retrieve catalogue years.", error)
        }
    }

    // TODO: Implement API call to gather courses in a catalogue
    const fetchCourses = async () => {
        try {
            // const response = await axios.get("Some route")
            // setCatalogueCourses(response.data)
        } catch (error) {
            console.error("Failed to retrieve courses for catalogue year " + selectedYear + ".", error)
        }
    }

    const addNewCourse = async (name: string, prefix: string, number: string) => {
        try {
            
            // Template addition
            let course = createDefaultCourseBlock()
            course.Course.name = name
            course.prefix = prefix
            course.number = number
            if (selectedYear === 2024) {
                setCourses24([...courses24, course])
            }
            else {
                setCourses25([...courses25, course])
            }

            // API call to add the course to the course catalogue
            // fetchCourses()
        } catch (error) {
            console.log("Failed to add a new course.", error)
        }
    }

    const renderCourses = (courseList: CourseBlock[]) => {
        return courseList
            .filter((course) => {
                return `${course.prefix} + " " + ${course.number} + " " + ${course.Course.name}`.toLowerCase().includes(courseQuery.toLowerCase())
            })
            .map((course) => {
                return (
                    <ComboboxOption
                        key={course.id}
                        value={course}
                        className="hover:bg-gray-200 cursor-pointer px-2 rounded-md"
                    >
                        {course.prefix + " " + course.number + " " + course.Course.name}
                    </ComboboxOption>
                )
            })
    }

    const updateCourses = (id:string, field: string, value: string) => {
        switch (selectedYear) {
            case 2024:
                const newCourses24 = courses24
                                        .map(course => {
                                            if (course.id === id) {
                                                return updateCourse(course.Course, field, value)
                                            }
                                            else {
                                                return course
                                            }
                                        })
                setCourses24(newCourses24)
                break
            case 2025:
                const newCourses25 = courses25
                                        .map(course => {
                                            if (course.id === id) {
                                                return updateCourse(course.Course, field, value)
                                            }
                                            else {
                                                return course
                                            }
                                        })
                setCourses25(newCourses25)
                break
            default:
                console.log("Wrong year")
        }
            
    }

    // Template code
    const plan = useContext(UserContext)?.user?.DegreePlan

    // Copied over from degree building window
    useEffect(() => {
        // fetchYears()
        // fetchCourses()
    }, [selectedYear, selectedCourse])

    return (
        <>
            <div className="flex flex-col gap-2 p-4">
                <div className="flex lg:flex-row max-lg:flex-col gap-2 w-full">
                    <div className="flex lg:flex-row max-lg:flex-col gap-2 w-full">
                        {/* Catalogue year dropdown (copy degree dropdown) */}
                        <Combobox
                            value={selectedYear}
                            onChange={(value) => {
                                if (value) {
                                    setSelectedYear(value)
                                }
                            }}
                            by={(yearA, yearB) => {
                                return yearA === yearB
                            }}
                        >
                            <div>
                                <ComboboxInput
                                    onChange={(event) => {
                                        setYearQuery(event.target.value)
                                    }}
                                    displayValue={(year: number) => {
                                        if (year <= 0) {
                                            return ""
                                        }
                                        return year.toString()
                                    }}
                                    placeholder="Search for a year"
                                    className="border-2 border-black rounded-md p-2 h-10 mb-1"
                                ></ComboboxInput>
                                <ComboboxOptions static className="border-black border-2 rounded-md min-w-50 w-fit empty:invisible">

                                    {/* TODO: Replace with actual state once its integrated */}
                                    {years
                                        .filter((year) => {
                                            return year.toString().toLowerCase().includes(yearQuery.toLowerCase())
                                        })
                                        .map((year) => {
                                            return (
                                                <ComboboxOption
                                                    key={year}
                                                    value={year}
                                                    className="hover:bg-gray-200 cursor-pointer px-2 rounded-md"
                                                >
                                                    {year}
                                                </ComboboxOption>
                                            )
                                        })}
                                </ComboboxOptions>
                            </div>
                        </Combobox>

                        {/* Course selection */}
                        {selectedYear !== 0 &&
                            <Combobox
                                value={selectedCourse}
                                onChange={(value) => {
                                    if (value) {
                                        setSelectedCourse(value)
                                    }
                                }}
                                by={(courseA, courseB) => {
                                    return courseA?.Course.name === courseB?.Course.name
                                }}
                            >
                                <div>
                                    <ComboboxInput
                                        onChange={(event) => {
                                            setCourseQuery(event.target.value)
                                        }}
                                        displayValue={(course: CourseBlock | null) => {
                                            if (course === null) {
                                                return ""
                                            }
                                            return course.prefix + " " + course.number + " " + course.Course.name
                                        }}
                                        placeholder="Search for a course"
                                        className="border-2 border-black rounded-md p-2 h-10 mb-1"
                                    ></ComboboxInput>
                                    <ComboboxOptions static className="border-black border-2 rounded-md min-w-50 w-fit h-50 overflow-y-auto empty:invisible">

                                        {/* TODO: Replace with actual state once its integrated */}
                                        {selectedYear === 2024 ? renderCourses(courses24) : renderCourses(courses25)}
                                    </ComboboxOptions>
                                </div>
                            </Combobox>
                        }
                    </div>

                    {/* Course addition */}
                    {selectedYear !== 0 && 
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
                    }
                </div>

                {/* Course building */}
                {selectedYear !== 0 && selectedCourse !== null ? (
                    <BuildCourse key={selectedCourse.Course.id} course={selectedCourse} update={updateCourses}></BuildCourse>
                ) : (
                    <div className="flex flex-col gap-2 max-lg:mt-4">
                        {selectedYear === 0 && <p>Please select a year</p>}
                        {selectedCourse === null && <p>Please select a course</p>}
                    </div>
                )}
            </div>
        </>
    )
}

export default CourseBuildingWindow