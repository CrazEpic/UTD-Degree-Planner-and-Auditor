import PlannerSection from "./PlannerSection"

function PlannerWindow() {
  return (
    <>
      <div>
        {/* Place for tabs to go 
            Toggle planner/graph
            Summer Semesters?
            etc?
        */}
      </div>
      <div className="w-7/10 left-0 border-green-300 border-[15px] overflow-auto p-[15px] pt-0">
        <PlannerSection></PlannerSection>
        <PlannerSection></PlannerSection>
        <PlannerSection></PlannerSection>
        <PlannerSection></PlannerSection>
        <PlannerSection></PlannerSection>
			</div>
    </>
  )
}

export default PlannerWindow