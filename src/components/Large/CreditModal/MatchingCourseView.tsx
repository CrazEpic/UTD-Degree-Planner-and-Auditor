import { CourseBlock, DegreePlanCourse } from "../../../types/degreeTest"
import { Button, Checkbox } from "@headlessui/react"
import { CheckIcon } from "@heroicons/react/24/outline"

const MatchingCourseView = ({
    course,
    name,
    selected,
    updateCourse,
}: {
    course: CourseBlock,
    name: string,
    selected: boolean,
    updateCourse(action: string, courseID: string): void,
}) => {
    return (
        <div className="flex flex-row gap-2 border rounded-lg items-center justify-between p-2 pr-0 w-full">
            <p className="line-clamp-2 max-w-15/20">
                <a className="text-[#037b3f]" href="">
                    {course.prefix + " " + course.number + " "}
                </a>
                {name}
            </p>
            <div className="mr-2">
                {/* Place a checkbox here */}
                <Checkbox
                    checked={selected}
                    onChange={() => {
                        if (!selected) {
                            updateCourse("ADD", course.id)
                        }
                        else {
                            updateCourse("REMOVE", course.id)
                        }
                    }}
                    className="group block lg:size-6 max-lg:size-8 rounded border bg-white"
                >
                    {selected && <CheckIcon></CheckIcon>}
                </Checkbox>
            </div>
        </div>
    )
}

export default MatchingCourseView
