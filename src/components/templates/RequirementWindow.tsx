import Requirement from "./Requirement"
import SearchWindow from "./SearchWindow"
import { Req } from "../../types/degreeTest"

const reqList : Req[] = [
  { 
    id: 1,
    name: "Core Curriculum",
    subReqs: [
      {
        id: 1,
        name: "Communication",
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
    name: "Name",
    subReqs: [],
    subCourses: [
      {
        id: 1,
        prefix: "CS",
        number: "1337",
        name: "Computer Science I",
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
    name: "Name",
    subReqs: [],
    subCourses: [],
  },
]

function RequirementWindow() {
  return (
    <> 
      <div className="w-3/10 border-l-2 flex flex-col gap-[15px] pt-[15px] pb-[15px]">
        <div className="flex flex-col gap-[15px] overflow-auto h-[calc(100vh-145px)] pl-[15px] pr-[15px]">
          {reqList.map((req) =>
            <Requirement key={req.id} name={req.id + ". " + req.name} depth={1} subReqs={req.subReqs} subCourses={req.subCourses}></Requirement>
          )}
        </div>
        <hr className="w-full"/>
        <SearchWindow></SearchWindow>
      </div>
    </>
  )
}

export default RequirementWindow