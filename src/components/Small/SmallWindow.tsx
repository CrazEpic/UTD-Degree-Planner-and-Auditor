import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react"
import RequirementWindow from "./Requirements/RequirementWindow"
import PrerequisiteWindow from "./Prerequisites/PrerequisiteWindow"

function SmallWindow() {
	return (
		<>
			<div className="max-w-[375px] min-w-[375px] p-4 overflow-auto border-l-2">
				<TabGroup className="flex flex-col gap-4">
					<TabList className="border-2 rounded-lg size-fit overflow-hidden">
						<Tab className="p-1 data-[selected]:bg-blue-500 data-[selected]:text-white data-[hover]:underline">
							Requirements
						</Tab>
						<Tab className="p-1 data-[selected]:bg-blue-500 data-[selected]:text-white data-[hover]:underline">
							Prerequisites
						</Tab>
					</TabList>
					<TabPanels>
						<TabPanel>
							<RequirementWindow></RequirementWindow>
						</TabPanel>
						<TabPanel>
							<PrerequisiteWindow ></PrerequisiteWindow>
						</TabPanel>
					</TabPanels>
				</TabGroup>
			</div>
		</>
	)
}

export default SmallWindow