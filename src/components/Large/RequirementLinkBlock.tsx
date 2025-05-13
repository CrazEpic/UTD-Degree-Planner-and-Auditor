import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid"
import ProgressBar from "../Small/Requirements/ProgressBar"
import { useState } from "react"
import { Block } from "../../types/block"

function updateProgress(progress: number[], add: boolean) : number[] {
    let newProgress = progress
    if (add) {
        newProgress[1] += 1
        newProgress[2] -= 1
    }
    else {
        newProgress[1] -= 1
        newProgress[2] += 1
    }
    return newProgress
}


const RequirementLinkBlock = ({
    req, 
    progress, 
    add, 
    remove, 
    full
}: {
    req: Block,
    progress: number[], 
    add: (id: string) => boolean, 
    remove: (id: string) => boolean, 
    full: () => boolean
}) => {
    
    const [bar, setBar] = useState(progress)
    const [hours, setHours] = useState(0)

    return (
        <>
            <div className="border rounded-lg items-center p-2 w-full">
                <div className="flex flex-row justify-between items-center gap-4">
                    {/* Text does not truncate or turn to ellipses*/}
                    <p className="line-clamp-1 justify-self-start">{req.blockName}</p>
                    <div className="flex flex-row ml-auto justify-self-end gap-2">
                        <ProgressBar progress={bar}></ProgressBar>
                        <div className={"flex flex-row items-center gap-2"}>
                            <button 
                                className="size-6 border rounded-sm" 
                                onClick={() => {
                                    if (hours > 0 && remove(req.blockID)) {
                                        setHours(hours - 1)
                                        setBar(updateProgress(bar, false))
                                    }
                                }}
                                disabled={hours == 0}
                            >
                                <MinusIcon></MinusIcon>
                            </button>
                            <button 
                                className="size-6 border rounded-sm"
                                onClick={() => {
                                    if (bar[2] > 0 && add(req.blockID)) {
                                        setHours(hours + 1)
                                        setBar(updateProgress(bar, true))
                                    }
                                }}
                                disabled={bar[2] == 0 || full()}
                            >
                                <PlusIcon></PlusIcon>
                            </button>
                        </div>
                    </div>
                    <p>{hours}</p>
                </div>
            </div>
        </>
    )
}

export default RequirementLinkBlock