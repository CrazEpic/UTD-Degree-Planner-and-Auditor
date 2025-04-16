import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react"
import { AcademicCapIcon, KeyIcon } from "@heroicons/react/24/outline"
import { Fragment } from "react/jsx-runtime"
import clsx from "clsx"
import RequirementWindow from "./Requirements/RequirementWindow"
import PrerequisiteWindow from "./Prerequisites/PrerequisiteWindow"
import { useContext } from "react"
import { UserContext } from "../../contexts/UserContext"

function SmallWindow() {
	const degreePlan = useContext(UserContext)?.user?.DegreePlan

	return (
		<>
			<div className="max-w-[375px] min-w-[375px] h-[calc(100vh-55px)] p-4 overflow-auto border-l-2">
				<TabGroup className="flex flex-col gap-4">
					<TabList className="flex flex-row justify-between items-end border-2 rounded-lg bg-white overflow-hidden pt-1">
						<Tab as={Fragment}>
							{({ hover, selected }) => (
								<button className="flex flex-col items-center w-full focus:outline-0">
									<AcademicCapIcon className={"size-6 " + clsx(selected && "stroke-[#e87500]")}></AcademicCapIcon>
									Degree
									<hr
										className={"size-1 w-full " + clsx(!selected && hover ? "opacity-50" : "")}
										color={clsx((selected || hover) && "#e87500")}
									/>
								</button>
							)}
						</Tab>
						<Tab as={Fragment}>
							{({ hover, selected }) => (
								<button className="flex flex-col items-center w-full focus:outline-0">
									<KeyIcon className={"size-6 " + clsx(selected && "stroke-[#e87500]")}></KeyIcon>
									Prereqs
									<hr
										className={"size-1 w-full " + clsx(!selected && hover ? "opacity-50" : "")}
										color={clsx((selected || hover) && "#e87500")}
									/>
								</button>
							)}
						</Tab>
					</TabList>
					<TabPanels>
						<TabPanel>
							<RequirementWindow degreeName={degreePlan?.degreeName} degreeYear={degreePlan?.degreeYear}></RequirementWindow>
						</TabPanel>
						<TabPanel>
							<PrerequisiteWindow></PrerequisiteWindow>
						</TabPanel>
					</TabPanels>
				</TabGroup>
			</div>
		</>
	)
}

export default SmallWindow
