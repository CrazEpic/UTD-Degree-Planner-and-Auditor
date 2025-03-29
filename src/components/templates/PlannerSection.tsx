import PlannerCourse from "./PlannerCourse"

function PlannerSection({name}: {name: string}) {

  const courseList = [
    ["CS", "1234", "Course Name", "AP"],
    ["SE", "2234", "Course Name", "T"],
    ["CE", "3234", "Course Name", "?"],
    ["MATH", "4234", "Course Name", ""],
    ["MATH", "4234", "Course Name", ""],
  ]

  return (
    <>
      <div className="w-[100%-30px] border-3 border rounded-[10px] mt-[15px]">
        <h1 className="h-[30px] text-xl text-[#e87500] font-bold m-[15px]">{name}</h1>
        {/* Convert this to a grid for future courses being added */}
        <div className="grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 grid-cols-2 gap-[15px] p-[15px] pt-0">
          {courseList.map((course) => 
            <PlannerCourse prefix={course[0]} number={course[1]} name={course[2]} tag={course[3]}></PlannerCourse>
          )}
        </div>
      </div>
    </>
  )
}

export default PlannerSection