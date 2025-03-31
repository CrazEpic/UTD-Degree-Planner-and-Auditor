import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react"
import RequirementWindow from "./requirements/RequirementWindow"
import PrerequisiteWindow from "./prerequisites/PrerequisiteWindow"

function SmallWindow() {
	return (
		<>
			<div className="max-w-[375px] min-w-[375px] p-[15px] overflow-auto border-l-2">
				<TabGroup className="flex flex-col gap-[15px]">
					<TabList className="border-2 rounded-[10px] w-fit">
						<Tab className="p-[2px] data-[selected]:bg-blue-500 data-[selected]:text-white data-[hover]:underline">
							Requirements
						</Tab>
						<Tab className="p-[2px] data-[selected]:bg-blue-500 data-[selected]:text-white data-[hover]:underline">
							Prerequisites
						</Tab>
					</TabList>
					<TabPanels>
						<TabPanel>
							<RequirementWindow></RequirementWindow>
						</TabPanel>
						<TabPanel>
							Prerequisite Window
							<PrerequisiteWindow></PrerequisiteWindow>
						</TabPanel>
					</TabPanels>
				</TabGroup>
			</div>
		</>
	)
}

export default SmallWindow