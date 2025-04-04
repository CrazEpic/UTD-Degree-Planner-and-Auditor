import { Button, Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react"
import { ChevronDownIcon } from "@heroicons/react/24/solid"
import { Requirement } from "../../types/degreeTest"
import ProgressBar from "./ProgressBar"
import RequirementCourse from "./RequirementCourse"
import { useState } from "react"

function RequirementBlock({requirement, depth, checkbox}: {requirement: Requirement, depth: number, checkbox: boolean}) {
  

  // Extremely ugly, just testing understanding
  const [selected, setSelected] = useState(false)
  const handleClick = () => {
    setSelected(!selected)
  }
  const MyButton = () => {
    return (
      <button className={"size-[24px] border-2 rounded-[5px] hover:bg-green-200" + (selected ? " bg-[#154734]" : " bg-[#ffffff]")} onClick={handleClick}> </button>
    )
  }

  const borderStyle = "border rounded-[10px] items-center p-[8px] pr-0 " + (depth > 1 ? "border-r-0 rounded-r-none " : "") 

  const progress : number[] = [
    1, // getCompleted()
    2, // getPlanned()
    3, // getUnplanned()
  ]

  let conditionType = ""
  const conditions = requirement.condition.split(" ")
  switch (conditions[0]) {
    case "":
      conditionType = "None"
      break;
    case "All":
      conditionType = "All"
      break;
    default:
      conditionType = "Some"
      if (conditions[1] == "Hours") {
        conditionType += " Hours"
      }
      else {
        conditionType += " Blocks"
      }
      break;
  }

  return (
    <>
      <div className={borderStyle + (selected && " bg-orange-300 overflow-hidden")}>
        <Disclosure>
          {/* Flexbox instead of grid wth*/}
          <div className="flex flex-row items-center pr-[8px]">
            <div className="flex flex-row items-center gap-[8px]">
              <DisclosureButton className="group py-2">
                <ChevronDownIcon className="size-[24px]"></ChevronDownIcon>
              </DisclosureButton>

              {/* Text does not truncate or turn to ellipses*/}
              <p className="line-clamp-1 justify-self-start">{requirement.name}</p>
            </div>
            <div className="flex flex-row ml-auto items-center justify-self-end mr-[8px] gap-[8px]">
              <ProgressBar progress={progress}></ProgressBar>
              {checkbox ? (
                <MyButton></MyButton>
                /* 
                  Headless UI Button
                  Trying to understand how to use 
                  the data-active and data-hover props
                  <Button></Button> 
                */  
              ) : (
                <div className="size-[24px]"></div>
              )}
            </div>
          </div>
          <DisclosurePanel className="flex flex-col gap-[12px] col-span-6">
            <p>{requirement.condition != "" ? "Complete " + requirement.condition : ""}</p>
            {requirement.subReqs.length != 0 &&
              <>
                {requirement.subReqs.map((req) =>
                  <RequirementBlock key={req.id} requirement={req} depth={depth + 1} checkbox={conditionType == "Some Blocks"}></RequirementBlock>
                )}
              </>
            }
            {requirement.subCourses.length != 0 &&
              <>
                {requirement.subCourses.map((course) =>
                  <RequirementCourse key={course.id} course={course}></RequirementCourse>
                )}
              </>
            }
            {requirement.matcher && <RequirementCourse course={{id: -1, prefix: "Add", number: "More", name: "Courses"}}></RequirementCourse>}
          </DisclosurePanel>
        </Disclosure>
      </div>
    </>
  )
}

export default RequirementBlock