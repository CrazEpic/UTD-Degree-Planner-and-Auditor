import { AcademicCapIcon, BookOpenIcon, KeyIcon, ArrowTrendingUpIcon } from "@heroicons/react/24/outline"
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react"
import clsx from 'clsx'
import { Fragment } from "react/jsx-runtime"
import PlannerWindow from "./Large/Planner/PlannerWindow"
import FlowchartWindow from "./Large/Flowchart/FlowchartWindow"
import RequirementWindow from "./Small/Requirements/RequirementWindow"
import PrerequisiteWindow from "./Small/Prerequisites/PrerequisiteWindow"

// Convert to Tabs probably
function MobileView() {
    return (
        <>
            <TabGroup>
                <TabList className="flex flex-row justify-between items-end bg-white w-full h-[55px] min-w-[375px] border">
                    <Tab as={Fragment}>
                        {({ hover, selected}) => (
                            <button className="flex flex-col items-center w-full">
                                <BookOpenIcon className={"size-6 " + clsx(selected && "stroke-[#e87500]")}></BookOpenIcon>
                                Planner
                                <hr className={"size-1 w-full " + clsx((!selected && hover) ? "opacity-50" : "")} color={clsx((selected || hover) && "#e87500")}/>
                            </button>
                        )}
                    </Tab>
                    <Tab as={Fragment}>
                        {({ hover, selected}) => (
                            <button className="flex flex-col items-center w-full">
                                <ArrowTrendingUpIcon className={"size-6 " + clsx(selected && "stroke-[#e87500]")}></ArrowTrendingUpIcon>
                                Flowchart
                                <hr className={"size-1 w-full " + clsx((!selected && hover) ? "opacity-50" : "")} color={clsx((selected || hover) && "#e87500")}/>
                            </button>
                        )}
                    </Tab> 
                    <Tab as={Fragment}>
                        {({ hover, selected}) => (
                            <button className="flex flex-col items-center w-full">
                                <AcademicCapIcon className={"size-6 " + clsx(selected && "stroke-[#e87500]")}></AcademicCapIcon>
                                Degree
                                <hr className={"size-1 w-full " + clsx((!selected && hover) ? "opacity-50" : "")} color={clsx((selected || hover) && "#e87500")}/>
                            </button>
                        )}
                    </Tab> 
                    <Tab as={Fragment}>
                        {({ hover, selected}) => (
                            <button className="flex flex-col items-center w-full">
                                <KeyIcon className={"size-6 " + clsx(selected && "stroke-[#e87500]")}></KeyIcon>
                                Prereqs
                                <hr className={"size-1 w-full " + clsx((!selected && hover) ? "opacity-50" : "")} color={clsx((selected || hover) && "#e87500")}/>
                            </button>
                        )}
                    </Tab> 
                </TabList>
                <TabPanels as="div" className="m-4">
                    <TabPanel>
                        <PlannerWindow></PlannerWindow>
                    </TabPanel>
                    <TabPanel>
                        <FlowchartWindow></FlowchartWindow>
                    </TabPanel>
                    <TabPanel>
                        <RequirementWindow></RequirementWindow>
                    </TabPanel>
                    <TabPanel>
                        <PrerequisiteWindow></PrerequisiteWindow>
                    </TabPanel>
                </TabPanels>
            </TabGroup>
        </>
    )
}

export default MobileView