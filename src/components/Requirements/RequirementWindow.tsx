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

function RequirementWindow() {
  return (
    <> 
      <div className="max-w-[375px] min-w-[375px] flex flex-col gap-[15px] p-[15px] overflow-auto border-l-2">
        {reqList.map((req) =>
          <RequirementBlock key={req.id} name={req.id + ". " + req.name} depth={1} subReqs={req.subReqs} subCourses={req.subCourses} matcher={req.matcher} checkbox={false}></RequirementBlock>
        )}
        {reqList.map((req) =>
          <RequirementBlock key={req.id} name={req.id + ". " + req.name} depth={1} subReqs={req.subReqs} subCourses={req.subCourses} matcher={req.matcher} checkbox={true}></RequirementBlock>
        )}
      </div>
    </>
  )
}

export default RequirementWindow