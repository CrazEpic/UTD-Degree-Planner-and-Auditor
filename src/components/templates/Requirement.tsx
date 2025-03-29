import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react"
import { ChevronDownIcon } from "@heroicons/react/24/solid"
import ProgressBar from "./ProgressBar"
import RequirementCourse from "./RequirementCourse"

function Requirement({toggle, depth}: {toggle: boolean, depth: number}) {
 
  const border_style = depth > 1 ? "border rounded-[10px] items-center p-[12px] pr-0 border-r-0 rounded-r-none" 
                                 : "border rounded-[10px] items-center p-[12px] pr-0"

  if (toggle) {
    return (
      <>
        <RequirementCourse border_style={border_style}></RequirementCourse>
        <RequirementCourse border_style={border_style}></RequirementCourse>
        <RequirementCourse border_style={border_style}></RequirementCourse>
        <RequirementCourse border_style={border_style}></RequirementCourse>
      </>
    )
  }
  else {
    return (
      <>
        <div className={border_style}>
          <Disclosure>
            <div className="grid grid-cols-6 items-center">
              <p className="col-span-3 line-clamp-1">1. Requirement Name</p>
              <div className="col-span-2 justify-self-end w-[140px]"><ProgressBar></ProgressBar></div>
              <DisclosureButton className="group py-2">
                <ChevronDownIcon className="size-[24px] justify-self-end mr-[15px]"></ChevronDownIcon>
              </DisclosureButton>
            </div>
            <DisclosurePanel className="flex flex-col gap-[12px] col-span-6">
              <Requirement toggle={depth >= 4} depth={depth + 1}></Requirement>
            </DisclosurePanel>
          </Disclosure>
        </div>
      </>
    )
  }
}

export default Requirement