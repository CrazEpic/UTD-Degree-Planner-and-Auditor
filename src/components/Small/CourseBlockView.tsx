import { PlusIcon } from "@heroicons/react/24/solid"
import { CourseBlock } from "../../types/degreeTest"
import { Button } from "@headlessui/react"

function click(message: string) {
    console.log(message)
}

function CourseBlockView({course, name}: {course: CourseBlock, name: string}) {

    {/* Replace with check in planned degree */}
    const planned = false

    return (
        <div className="flex flex-row gap-[8px] border rounded-[10px] items-center justify-center p-[8px] pr-0 border-r-0 rounded-r-none">
        {name == "Matcher" ? (
            <PlusIcon className="size-[24px]"></PlusIcon>
        ) : (
            <>
                <p className="line-clamp-2 max-w-15/20">
                    <a className="text-[#037b3f]" href="">{course.prefix + " " + course.number + " "}</a>
                    {name}
                </p>
                {planned ? (
                    <p className="underline ml-auto mr-[15px]">Planned</p>
                ) : (
                    <Button className="hover:bg-blue-200 size-[24px] ml-auto mr-[15px]" onClick={() => click("Add Course")}>
                        <PlusIcon></PlusIcon>
                    </Button>
                )}
            </>
            )}
        </div>
    )
}

export default CourseBlockView