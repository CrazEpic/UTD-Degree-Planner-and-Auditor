import { Block } from "../../types/degreeTest"
import RequirementLinkBlock from "./RequirementLinkBlock"

function click(message: string) {
    console.log(message)
}

function getProgress() {
    return [1, 2, 3]
}

function CourseLink({name, hours, requirementList}: {name: string, hours:number, requirementList: Block[]}) {
    
    const currentHours = 0
    
    return (
        <>
            <div className="flex flex-col items-center w-[100%-32px] border-2 rounded-lg p-4 gap-4">
                <div className="flex flex-row justify-between w-full">
                    <h1 className="h-8 text-xl">{name}</h1>
                    {name != "Future Courses" && 
                        <div className="flex flex-row items-center gap-2">
                            {/* Make the 12 editable inline?? */}
                            <p className="text-xl">
                                {/* This should be passed in some way */}
                                {currentHours + "/" + hours}
                            </p>
                        </div>
                    }
                </div>
                <p className="text-lg">Matching Requirements</p>
                <hr className="w-full" />
                <div className="flex flex-col gap-4 w-full px-2">
                    {requirementList.map((requirement) => 
                        <>
                            <RequirementLinkBlock name={requirement.blockName} progress={getProgress()}></RequirementLinkBlock>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}

export default CourseLink