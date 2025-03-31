import RequirementBlock from "./RequirementBlock"
import { Requirement } from "../../types/degreeTest"

const reqList : Requirement[] = [
  { 
    id: 1,
    name: "Core Curriculum",
    matcher: false,
    subReqs: [
      {
        id: 1,
        name: "Communication",
        matcher: true,
        subReqs: [],
        subCourses: [
          {
            id: 1,
            prefix: "RHET",
            number: "1302",
            name: "Rhetoric",
          },
          {
            id: 2,
            prefix: "ECS",
            number: "2390",
            name: "Professional and Technical Communication",
          },
        ],
      },
    ],
    subCourses: [],
  },
  { 
    id: 2,
    name: "Major",
    matcher: false,
    subReqs: [],
    subCourses: [
      {
        id: 1,
        prefix: "CS",
        number: "1337",
        name: "Electrical and Computer Engineering Laboratory in Computer Systems and Computer Engineering",
      },
      {
        id: 2,
        prefix: "CS",
        number: "1337",
        name: "Computer Science I",
      },
    ],
  },
  { 
    id: 3,
    name: "Electives",
    matcher: true,
    subReqs: [],
    subCourses: [],
  },
  { 
    id: 4,
    name: "Unrelated Courses",
    matcher: true,
    subReqs: [],
    subCourses: [],
  },
]

const footnotes : string[] = [
  "1. Curriculum Requirements can be fulfilled by other approved courses. The courses listed are recommended as the most efficient way to satisfy both Core Curriculum and Major Requirements at UT Dallas.",
  "2. Semester credit hours fulfill the communication component of the Core Curriculum.",
  "3. Three semester credit hours of Calculus are counted under Mathematics Core, and five semester credit hours of Calculus are counted as Component Area Option Core.",
  "4. Six semester credit hours of Physics are counted under Science core, and one semester credit hour of Physics (PHYS 2125) is counted as Component Area Option Core.",
  "5. Transfer students with sufficient background may petition to substitute upper-division semester credit hours in the major for this class.",
  "6. BS in Data Science students can substitute MATH 3315 for CS 2305.",
  "7. BS in Data Science students can substitute STAT 3355 for CS 3341.",
]

function RequirementWindow() {
  return (
    <> 
      <div className="flex flex-col gap-[15px]">
        {reqList.map((req) =>
          <RequirementBlock key={req.id} name={req.id + ". " + req.name} depth={1} subReqs={req.subReqs} subCourses={req.subCourses} matcher={req.matcher} checkbox={false}></RequirementBlock>
        )}
        {reqList.map((req) =>
          <RequirementBlock key={req.id} name={req.id + ". " + req.name} depth={1} subReqs={req.subReqs} subCourses={req.subCourses} matcher={req.matcher} checkbox={true}></RequirementBlock>
        )}
        {footnotes.map((footnote) =>
          <p>{footnote}</p>
        )}
      </div>
    </>
  )
}

export default RequirementWindow