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
      <div className="w-full overflow-auto p-[15px] pt-0">
        <PlannerSection name="Future Courses"></PlannerSection>
        <PlannerSection name="Fall 2025"></PlannerSection>
        <PlannerSection name="Spring 2026"></PlannerSection>
        <PlannerSection name="Fall 2026"></PlannerSection>
        <PlannerSection name="Spring 2027"></PlannerSection>
        <PlannerSection name="Fall 2023 (Past Semester)"></PlannerSection>
        <PlannerSection name="Spring 2024 (Past Semester)"></PlannerSection>
        <PlannerSection name="Fall 2024 (Past Semester)"></PlannerSection>
        <PlannerSection name="Spring 2025 (Past Semester)"></PlannerSection>
        <PlannerSection name="Exam Credits (AP/IB/etc.)"></PlannerSection>
        <PlannerSection name="Transferred Credits"></PlannerSection>
			</div>
    </>
  )
}

export default PlannerWindow