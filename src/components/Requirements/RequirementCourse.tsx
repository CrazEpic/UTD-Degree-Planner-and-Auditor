import { PlusIcon } from "@heroicons/react/24/solid"
import { Course } from "../../types/degreeTest"

function RequirementCourse({course}: {course: Course}) {

  {/* To be replaced with actual logic*/}
  const planned = Math.random() > 0.5

  {/* "Add More" Option*/}
  const addMore = course.prefix == "Add"

  return (
    <div className="flex flex-row gap-[12px] border rounded-[10px] items-center justify-center p-[12px] pr-0 border-r-0 rounded-r-none">
      {addMore ? (
        <PlusIcon className="size-[24px]"></PlusIcon>
      ) : (
        <>
          <p className="line-clamp-2 max-w-15/20">
            <a className="text-[#037b3f]" href="">{course.prefix + " " + course.number + " "}</a>
            {course.name}
          </p>
          {planned ? (
            <PlusIcon className="size-[24px]  ml-auto mr-[15px]"></PlusIcon>
          ) : (
            <p className="underline ml-auto mr-[15px]">Planned</p>
          )}
        </>
      )}
    </div>
  )
}

export default RequirementCourse