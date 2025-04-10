import { Course } from "../../../types/degreeTest"
import PlannerCourse from "./PlannerCourse"
import { LockClosedIcon } from "@heroicons/react/24/outline"
import { Button } from "@headlessui/react"

// Grabbing the second number in the of the course.number
// This does not work for internship and other similar course requirements (V)
function currentHours(courseList: Course[]) {
    let total = 0
    for (let i = 0; i < courseList.length; i++)
        total += parseInt(courseList[i].number.split("")[1])
    return total
}

function click(message: string) {
    console.log(message)
}

function PlannerSection({name, courseList}: {name: string, courseList: Course[]}) {
    return (
        <>
            <div className="w-[100%-30px] border-3 rounded-[10px] min-h-52">
                <div className="flex flex-row justify-between">
                <h1 className="h-[30px] text-xl text-[#e87500] font-bold m-[15px]">{name}</h1>
                {name != "Future Courses" && 
                    <div className="flex flex-row items-center m-[15px] gap-[8px]">
                        {/* Make the 12 editable inline?? */}
                        <p className="text-xl">
                            {currentHours(courseList) + "/" + 12}
                        </p>
                        <Button className="hover:bg-blue-200" onClick={() => click("Lock")}>
                            <LockClosedIcon className="size-[24px]" color="#808080"></LockClosedIcon>
                        </Button>
                    </div>
                }
                </div>
                <div className="grid gap-[15px] p-[15px] pt-0 place-items-center" style={{gridTemplateColumns: "repeat(auto-fill, minmax(288px, 1fr))"}}>
                    {courseList.map((course) => 
                        // Key could be the prefix + number (there should be no duplicate in a degree plan)
                        <PlannerCourse prefix={course.prefix} number={course.number} name={course.name} tag={course.flag}></PlannerCourse>
                    )}
                </div>
            </div>
        </>
    )
}

export default PlannerSection