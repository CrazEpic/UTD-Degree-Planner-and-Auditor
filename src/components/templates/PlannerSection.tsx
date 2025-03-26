import PlannerCourse from "./PlannerCourse"

function PlannerSection() {
  return (
    <>
      <div className="w-[100%-30px] border-3 border rounded-[10px] mt-[15px]">
        <h1 className="h-[30px] text-xl text-[#e87500] m-[15px]">Default Section</h1>
        {/* Convert this to a grid for future courses being added */}
        <div className="flex flex-row gap-[15px] justify-center p-[15px] pt-0">
          <PlannerCourse></PlannerCourse>
          <PlannerCourse></PlannerCourse>
          <PlannerCourse></PlannerCourse>
          <PlannerCourse></PlannerCourse>
        </div>
      </div>
    </>
  )
}

export default PlannerSection