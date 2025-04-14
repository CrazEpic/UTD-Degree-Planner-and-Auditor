import { PlusIcon } from "@heroicons/react/24/solid"
import { Button } from "@headlessui/react"
import { MatcherGroupBlock } from "../../types/degreeTest"
import { useContext } from "react"
import { MatcherContext } from "../../contexts/MatcherContext"

function MatcherBlockView({matcher} : {matcher: MatcherGroupBlock}) {

    const searchCourses = useContext(MatcherContext)?.search

    return (
        <div className="flex flex-row gap-2 border rounded-lg items-center justify-center p-2 pr-0 border-r-0 rounded-r-none">
            <Button 
                className="hover:bg-blue-200 size-6 m-auto" 
                onClick={() => {
                    console.log("Matcher")

                    if (searchCourses) {
                        // pass the matcher conditions to the searchCourses() call
                        searchCourses(matcher.matcher)
                    }
                }}
            >
                <PlusIcon className="size-6"></PlusIcon>
            </Button>
        </div>
    )
}

export default MatcherBlockView