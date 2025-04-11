import { Tab, TabGroup, TabList, TabPanel, TabPanels, Menu, MenuButton, MenuItem, MenuItems  } from "@headlessui/react"
import { Cog6ToothIcon } from "@heroicons/react/24/outline"
import PlannerWindow from "./Planner/PlannerWindow"
import FlowchartWindow from "./Flowchart/FlowchartWindow"

function click(message: string) {
	console.log(message)
}

function LargeWindow() {
	return (
		<>
			<div className="w-full overflow-auto p-[15px]">
				<TabGroup>
					<div className="flex flex-row justify-between relative">
						<TabList className="border-2 rounded-[10px] size-fit overflow-hidden">
							<Tab className="p-[4px] data-[selected]:bg-blue-500 data-[selected]:text-white data-[hover]:underline">
								Planner
							</Tab>
							<Tab className="p-[4px] data-[selected]:bg-blue-500 data-[selected]:text-white data-[hover]:underline">
								Flowchart
							</Tab>
						</TabList>
						{/* Feels like text should be here? 
								Or at least something should
								<p className="m-[15px] text-2xl">MY DEGREE PLAN</p> 
						*/}
						<Menu as="div" className="w-fit">
							<MenuButton className="hover:bg-blue-200">
								<Cog6ToothIcon className="size-[32px]"></Cog6ToothIcon>
							</MenuButton>
							<MenuItems className="absolute right-0 border-2 rounded-[10px] bg-white flex flex-col z-10">
								<MenuItem as="button" className="text-xl mx-2 my-3 text-nowrap" onClick={() => click("One")}>
									Setting 1
								</MenuItem>
								<hr />
								<MenuItem as="button" className="text-xl mx-2 my-3 text-nowrap" onClick={() => click("Two")}>
									Setting 2
								</MenuItem>
								<hr />
								<MenuItem as="button" className="text-xl mx-2 my-3 text-nowrap" onClick={() => click("Three")}>
									Setting 3
								</MenuItem>
							</MenuItems>
						</Menu>
					</div>
					<TabPanels>
						<TabPanel>
							<PlannerWindow></PlannerWindow>
						</TabPanel>
						<TabPanel>
							<FlowchartWindow></FlowchartWindow>
						</TabPanel>
					</TabPanels>
				</TabGroup>
			</div>
		</>
	)
}

export default LargeWindow