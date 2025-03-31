import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react"
import { CogIcon } from "@heroicons/react/24/solid"
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
      <div className="w-full overflow-auto p-[15px]">
        <TabGroup>
          <div className="flex flex-row justify-between">
            <TabList className="border-2 rounded-[10px] w-fit">
              <Tab className="p-[2px] data-[selected]:bg-blue-500 data-[selected]:text-white data-[hover]:underline">
                Planner
              </Tab>
              <Tab className="p-[2px] data-[selected]:bg-blue-500 data-[selected]:text-white data-[hover]:underline">
                Flowchart
              </Tab>
            </TabList>
            {/* Feels like text should be here? 
                Or at least something should
                <p className="m-[15px] text-2xl">MY DEGREE PLAN</p> 
            */}
            <CogIcon className="size-[32px]"></CogIcon>
          </div>
          <TabPanels>
            <TabPanel>
              <div className="">
                {sections.map((name) =>
                  <PlannerSection name={name}></PlannerSection>
                )}
              </div>
            </TabPanel>
            <TabPanel>
              Flowchart Window
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
    </>
  )
}

export default PlannerWindow