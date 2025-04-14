import { AcademicCapIcon, BookOpenIcon, KeyIcon, ArrowTrendingUpIcon } from "@heroicons/react/24/outline"
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react"
import clsx from 'clsx'
import { Fragment } from "react/jsx-runtime"
import PlannerWindow from "./Large/Planner/PlannerWindow"
import FlowchartWindow from "./Large/Flowchart/FlowchartWindow"
import RequirementWindow from "./Small/Requirements/RequirementWindow"
import PrerequisiteWindow from "./Small/Prerequisites/PrerequisiteWindow"
import { useState } from "react"
import { Block, Course } from "../types/degreeTest"
import { LinkContext } from "../contexts/LinkContext"
import CourseLink from "./Large/CourseLink"

function createDefaultBlock() {
	return {
		blockId: "id",
		blockName: "Requirement Name",
		parentBlockId: "",
		blockPosition: 0,
		innerBlocks: [],
		blockType: 'NonTerminal',
		blockContent: {
			id: "",
			conditions: {},
		},
	}
}

const reqList : Block[] = [
    createDefaultBlock(),
    createDefaultBlock(),
    createDefaultBlock(),
]

function MobileView() {

    // For course linking
    const [mask, setMask] = useState(false)
    const [course, setCourse] = useState<Course | null>(null)

    /* 	Implement linkCourse()
    const linkCourse = async () => {
        try {
            // Find requirements API
        } catch (error) {
            console.error("Error fetching requirements:", error)
        }
    } 
    */
    const linkCourse = (c: Course) => {
        setMask(true)
        setCourse(c)
    }

    /* 	Implement submitLink()
    const linkCourse = async () => {
        try {
            // Update degree plan API
        } catch (error) {
            console.error("Error linking course:", error)
        }
    } 
    */
    const submitLink = () => {
        setMask(false)
        setCourse(null)
    }

    /* 	Implement cancelLink()
    Might not even need an API call just remove the mask and move on?
    */
    const cancelLink = () => {
        setMask(false)
        setCourse(null)
    }

    return (
        <>
            <LinkContext.Provider value={{linkCourse: linkCourse, cancelLink: cancelLink, submitLink: submitLink}}>
                {mask && course != null &&
                    <div className="absolute m-auto inset-0 w-fit h-fit bg-white rounded-lg z-50">
                        <CourseLink name={course.name} hours={parseInt(course.number[1])} requirementList={reqList}></CourseLink>
                    </div>
                }
                <TabGroup as="div" className={"relative " + (mask ? "backdrop-brightness-70 brightness-70" : "")}>
                    <TabList className="flex flex-row justify-between items-end w-full h-[55px] min-w-[375px] border">
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
            </LinkContext.Provider>
        </>
    )
}

export default MobileView