import { PlusIcon } from "@heroicons/react/24/solid"
import { CourseBlock } from "../../types/degreeTest"
import { Button } from "@headlessui/react"

function click(message: string) {
    console.log(message)
}

function CourseLinkBlock({requirement, name}: {requirement: CourseBlock, name: string}) {

    {/* Replace with check in planned degree */}
    const planned = false

    return (
        <div className="flex flex-row gap-2 border rounded-lg items-center justify-center p-2 w-full">
            {name == "Matcher" ? (
                <PlusIcon className="size-[24px]"></PlusIcon>
            ) : (
                <>
                    <p className="line-clamp-2 max-w-15/20">
                        <a className="text-[#037b3f]" href="">{requirement.prefix + " " + requirement.number + " "}</a>
                        {name}
                    </p>
                    {planned ? (
                        <p className="underline ml-auto mr-4">Planned</p>
                    ) : (
                        <Button className="hover:bg-blue-200 size-6 ml-auto mr-4" onClick={() => click("Add Course")}>
                            <PlusIcon></PlusIcon>
                        </Button>
                    )}
                </>
            )}
        </div>
    )
}

export default CourseLinkBlock