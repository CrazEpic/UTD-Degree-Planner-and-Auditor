import { CourseBlock } from "../../types/degreeTest"
import { Button, Input } from "@headlessui/react"
import CourseBlockView from "../BlockViews/CourseBlockView"
import { useContext, useState } from "react"
import { XMarkIcon, ChevronLeftIcon } from "@heroicons/react/24/outline"
import { MatcherContext } from "../../contexts/MatcherContext"

function createDefaultCourseBlock() {
    return {
        id: "id",
        number: "1337",
        prefix: "CS",
    }
}

const cList : CourseBlock[] = [
    createDefaultCourseBlock(),
    createDefaultCourseBlock(),
    createDefaultCourseBlock(),
    createDefaultCourseBlock(),
    createDefaultCourseBlock(),
    createDefaultCourseBlock(),
    createDefaultCourseBlock(),
    createDefaultCourseBlock(),
    createDefaultCourseBlock(),
    createDefaultCourseBlock(),
    createDefaultCourseBlock(),
    createDefaultCourseBlock(),
    createDefaultCourseBlock(),
    createDefaultCourseBlock(),
    createDefaultCourseBlock(),
    createDefaultCourseBlock(),
    createDefaultCourseBlock(),
    createDefaultCourseBlock(),
    createDefaultCourseBlock(),
    createDefaultCourseBlock(),
]

function SearchWindow({conditions}: {conditions: any}) {

    const [input, setInput] = useState('')
    const [courses, setCourses] = useState<CourseBlock[]>([])

    const endSearch = useContext(MatcherContext)?.end

    // Add a timeout for search to not search on every keystroke
    // This is called debouncing?
    const search = async () => {
        try {
            // API call for search
            // Parse the Json
            // use setCourses() to refresh the window and display results
            setCourses(cList)
        } catch (error) {
            console.error('Search failed', error)
        }
    }

    return (
        <>
            {/* Figure out the height here please for the love of all that lives */}
            <div className="max-w-[375px] min-w-[375px] h-[calc(100vh-55px)] p-4">
                <div className="flex flex-row justify-between center-items h-8 border-2 rounded-lg border-b-0 rounded-b-none">
                    
                    
                    {/* Switch to Combobox and use static */}
                    <Button 
                        className="size-8"
                        onClick={() => {
                            console.log("End Search")
                            if (endSearch) endSearch()
                        }}
                    >
                        <ChevronLeftIcon></ChevronLeftIcon>
                    </Button>
                    <Input 
                        className="w-full p-1 focus:outline-none focus:border-r-1 focus:border-l-1" 
                        type="text" 
                        placeholder="Course Name or CR ####"
                        onChange={(e) => {
                            setInput(e.target.value)
                            search()
                        }}
                    >   
                    </Input>
                    <Button 
                        className="size-8 p-1" 
                        onClick={() => {
                            console.log("Clear Search")
                            setInput('')
                        }}
                    >
                        <XMarkIcon></XMarkIcon>
                    </Button>
                </div>
                <hr />
                <div className="border-2 rounded-lg border-t-0 rounded-t-none h-[calc(100vh-119px)] overflow-auto">
                    <div className="flex flex-col gap-2 p-4">
                        {courses.length != 0 ?
                            (
                                <>
                                    {courses.map((course: CourseBlock) => 
                                        <CourseBlockView course={course} name={"Course Name"} indent={false}></CourseBlockView>
                                    )}
                                </>
                            ) : (
                                <>
                                    <p>Course list is currently empty</p>
                                </>
                            )
                        }
                    </div>
                </div>
            </div>
            
        </>
    )
}

export default SearchWindow