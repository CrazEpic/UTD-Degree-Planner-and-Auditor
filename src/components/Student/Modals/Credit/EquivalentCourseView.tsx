import { Checkbox } from "@headlessui/react"
import { CheckIcon } from "@heroicons/react/24/outline"
import { Course } from "../../../../types/degree"

const EquivalentCourseView = ({
    course,
    selected,
    updateCourse,
}: {
    course: Course,
    selected: boolean,
    updateCourse(action: string, coursePrefix: string, courseNumber: string): void,
}) => {
    return (
        <div className="flex flex-row gap-2 border rounded-lg items-center justify-between p-2 pr-0 w-full">
            <p className="line-clamp-2 max-w-15/20">
                <a className="text-[#037b3f]" href={`https://catalog.utdallas.edu/2024/undergraduate/courses/${course.prefix.toLowerCase() + course.number}`}>
                    {course.prefix + " " + course.number + " "}
                </a>
                {course.name}
            </p>
            <div className="mr-2">
                <Checkbox
                    checked={selected}
                    onChange={() => {
                        if (!selected) {
                            updateCourse("ADD", course.prefix, course.number)
                        }
                        else {
                            updateCourse("REMOVE", course.prefix, course.number)
                        }
                    }}
                    className="group block size-8 rounded border bg-white"
                >
                    {selected && <CheckIcon></CheckIcon>}
                </Checkbox>
            </div>
        </div>
    )
}

export default EquivalentCourseView
