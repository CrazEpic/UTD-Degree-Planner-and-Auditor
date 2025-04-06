import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react"
import { CogIcon } from "@heroicons/react/24/solid"
import PlannerWindow from "./Planner/PlannerWindow"
import FlowchartWindow from "./Flowchart/FlowchartWindow"

function LargeWindow() {
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
							<PlannerWindow></PlannerWindow>
						</TabPanel>
						<TabPanel>
							Flowchart Window
							<FlowchartWindow></FlowchartWindow>
						</TabPanel>
					</TabPanels>
				</TabGroup>
			</div>
		</>
	)
}

export default LargeWindow