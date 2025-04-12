import { PlusIcon } from "@heroicons/react/24/solid"
import { Button } from "@headlessui/react"
import { MatcherGroupBlock } from "../../types/degreeTest"

function click(message: string) {
    console.log(message)
}

function MatcherBlockView({matcher} : {matcher: MatcherGroupBlock}) {

    // The matcher will be used for finding the relevant courses

    return (
        <div className="flex flex-row gap-2 border rounded-lg items-center justify-center p-2 pr-0 border-r-0 rounded-r-none">
            <Button className="hover:bg-blue-200 size-6 ml-auto mr-4" onClick={() => click("Matcher")}>
                <PlusIcon className="size-6"></PlusIcon>
            </Button>
        </div>
    )
}

export default MatcherBlockView