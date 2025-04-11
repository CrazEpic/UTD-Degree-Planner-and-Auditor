import { PlusIcon } from "@heroicons/react/24/solid"
import { Button } from "@headlessui/react"
import { MatcherGroupBlock } from "../../types/degreeTest"

function click(message: string) {
    console.log(message)
}

function MatcherBlockView({matcher} : {matcher: MatcherGroupBlock}) {

    // Use the matcher here somewhere

    return (
        <div className="flex flex-row gap-[8px] border rounded-[10px] items-center justify-center p-[8px] pr-0 border-r-0 rounded-r-none">
            <Button className="hover:bg-blue-200 size-[24px] ml-auto mr-[15px]" onClick={() => click("Add Course")}>
                <PlusIcon className="size-[24px]"></PlusIcon>
            </Button>
        </div>
    )
}

export default MatcherBlockView