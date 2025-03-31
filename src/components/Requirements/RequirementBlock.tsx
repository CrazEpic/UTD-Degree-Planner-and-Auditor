import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react"
import { ChevronDownIcon } from "@heroicons/react/24/solid"
import ProgressBar from "./ProgressBar"
import RequirementCourse from "./RequirementCourse"
import { Requirement, Course } from "../../types/degreeTest"

function RequirementBlock({name, depth, subReqs, subCourses, matcher, checkbox}: {name:string, depth: number, subReqs: Requirement[], subCourses: Course[], matcher: boolean, checkbox: boolean}) {
 
  const border_style = "border rounded-[10px] items-center p-[12px] pr-0" + (depth > 1 ? " border-r-0 rounded-r-none" : "") 
  
  {/* Placeholder for + course*/}
  const addMoreCourse = {
    id: 2,
    prefix: "Add",
    number: "",
    name: "",
  }

  return (
    <>
      <div className={border_style}>
        <Disclosure>
          <div className="grid grid-cols-9 items-center">
            <DisclosureButton className="group py-2">
              <ChevronDownIcon className="size-[24px]"></ChevronDownIcon>
            </DisclosureButton>

            {/* Text does not truncate or turn to ellipses*/}
            <p className="col-span-4 truncate justify-self-start">{name}</p>
            <div className="col-span-3 justify-self-end w-full max-w-[140px] mr-[15px]">
              <ProgressBar></ProgressBar>
            </div>
            {checkbox && <img className="size-[24px] "src="" alt="" />}
          </div>

          { subReqs.length == 0 ? (
            <DisclosurePanel className="flex flex-col gap-[12px] col-span-6">
              {subCourses.map((course) =>
                <RequirementCourse key={course.id} course={course}></RequirementCourse>
              )}
              {matcher && <RequirementCourse course={addMoreCourse}></RequirementCourse>}
              </DisclosurePanel>
          ) : (
            <DisclosurePanel className="flex flex-col gap-[12px] col-span-6">
              {subReqs.map((req) =>
                <RequirementBlock key={req.id} name={(depth <= 1 ? "" : req.id + ". ") + req.name} depth={depth + 1} subReqs={req.subReqs} subCourses={req.subCourses} matcher={req.matcher} checkbox={false}></RequirementBlock>
              )}
            </DisclosurePanel>
          )}
        </Disclosure>
      </div>
    </>
  )
}

export default RequirementBlock