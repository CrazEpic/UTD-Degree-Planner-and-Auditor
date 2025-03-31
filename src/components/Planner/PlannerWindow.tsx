import PlannerSection from "./PlannerSection"

const sections : string[] = [
  "Future Courses", 
  "Fall 2025", 
  "Spring 2026",
  "Fall 2026", 
  "Spring 2027", 
  "Fall 2023 (Past Semester)",
  "Spring 2024 (Past Semester)", 
  "Fall 2024 (Past Semester)", 
  "Spring 2025 (Past Semester)",
  "Test Credits (AP/IB/CLEP/etc.)", 
  "Transferred Credits", 
]

function PlannerWindow() {
  return (
    <>
      {sections.map((name) =>
        <PlannerSection name={name}></PlannerSection>
      )}
    </>
  )
}

export default PlannerWindow