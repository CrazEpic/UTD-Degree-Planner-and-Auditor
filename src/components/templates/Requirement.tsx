import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react"
import { ChevronDownIcon } from "@heroicons/react/24/solid"
import ProgressBar from "./ProgressBar"
import RequirementCourse from "./RequirementCourse"
import { Req, Course } from "../../types/degreeTest"

function Requirement({name, depth, subReqs, subCourses}: {name:string, depth: number, subReqs: Req[], subCourses: Course[]}) {
 
  const border_style = "border rounded-[10px] items-center p-[12px] pr-0" + (depth > 1 ? " border-r-0 rounded-r-none" : "") 
  
  const defaultCourse = {
    id: 1,
    prefix: "CR",
    number: "1234",
    name: "Course Name",
  }

  return (
    <>
      <div className={border_style}>
        <Disclosure>
          <div className="grid grid-cols-6 items-center">
            <p className="col-span-3 line-clamp-1">{name}</p>
            <div className="col-span-2 justify-self-end w-full max-w-[140px]"><ProgressBar></ProgressBar></div>
            <DisclosureButton className="group py-2">
              <ChevronDownIcon className="size-[24px] justify-self-end mr-[15px]"></ChevronDownIcon>
            </DisclosureButton>
          </div>
          { subReqs.length == 0 ? (
            <DisclosurePanel className="flex flex-col gap-[12px] col-span-6">
              {subCourses.map((course) =>
                <RequirementCourse key={course.id} course={course}></RequirementCourse>
              )}

              {/* Implement "Add More" Courses */}
              <RequirementCourse course={defaultCourse}></RequirementCourse>
              </DisclosurePanel>
          ) : (
            <DisclosurePanel className="flex flex-col gap-[12px] col-span-6">
              {subReqs.map((req) =>
                <Requirement key={req.id} name={req.id + ". " + req.name} depth={depth + 1} subReqs={req.subReqs} subCourses={req.subCourses}></Requirement>
              )}
              
              </DisclosurePanel>
          )}
        </Disclosure>
      </div>
    </>
  )
}

export default Requirement