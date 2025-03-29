import {} from "@heroicons/react/24/solid"
import { Course } from "../../types/degreeTest"

function RequirementCourse({course}: {course: Course}) {
  return (
    <>
      <div className={"flex flex-row border rounded-[10px] items-center p-[12px] pr-0 border-r-0 rounded-r-none"}>
        <p className="pr-1 text-[#037b3f]">{course.prefix + " " + course.number}</p>
        <p className="">{course.name}</p>
        {/* Replace with an icon for the checkbox */}
        <img className="size-[24px] ml-auto mr-[15px]" src="" alt="" />
      </div>
    </>
  )
}

export default RequirementCourse