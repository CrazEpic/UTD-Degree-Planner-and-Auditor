import { EllipsisVerticalIcon } from "@heroicons/react/24/solid"

function PlannerCourse({prefix, number, name, tag}: {prefix: string, number: string, name: string, tag: string}) {
  return (
    <>
      <div className="border-3 rounded-[10px] w-full h-[125px] p-[3px] flex flex-col">
        <div>
          <p className="float-left">{tag}</p>
          <EllipsisVerticalIcon className="size-5 float-right"></EllipsisVerticalIcon>
        </div>
        <h1 className="text-xl text-center self-center">{prefix + " " + number}</h1>
        <p className="text-md text-center self-center line-clamp-2 max-w-8/10">{name}</p>
      </div>
    </>
  )
}

// Learn to create a default version
// Course Name CR 1234

export default PlannerCourse