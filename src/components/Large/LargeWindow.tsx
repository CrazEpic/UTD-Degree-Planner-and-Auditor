import { Tab, TabGroup, TabList, TabPanel, TabPanels, Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import { AcademicCapIcon, ArrowTrendingUpIcon, BookOpenIcon, Cog6ToothIcon, KeyIcon } from "@heroicons/react/24/outline"
import PlannerWindow from "./Planner/PlannerWindow"
import FlowchartWindow from "./Flowchart/FlowchartWindow"
import CourseLink from "./CourseLink"
import { Block, Course } from "../../types/degreeTest"
import { LinkContext } from "../../contexts/LinkContext"
import { UserContext } from "../../contexts/UserContext"
import { Fragment } from "react/jsx-runtime"
import clsx from "clsx"
import { useContext, useState } from "react"
import RequirementWindow from "../Small/Requirements/RequirementWindow"
import PrerequisiteWindow from "../Small/Prerequisites/PrerequisiteWindow"

function createDefaultBlock() {
	return {
		blockId: "id",
		blockName: "Requirement Name",
		parentBlockId: "",
		blockPosition: 0,
		innerBlocks: [],
		blockType: "NonTerminal",
		blockContent: {
			id: "",
			conditions: {},
		},
	}
}

const reqList: Block[] = [createDefaultBlock(), createDefaultBlock(), createDefaultBlock()]

function click(message: string) {
	console.log(message)
}

function LargeWindow() {
	const degreePlan = useContext(UserContext)?.user?.DegreePlan

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
			<LinkContext.Provider value={{ linkCourse: linkCourse, cancelLink: cancelLink, submitLink: submitLink }}>
				<div className="w-full overflow-auto relative">
					{/* Make sure to make this the focus or bad things happen*/}
					{mask && course != null && (
						<div className="absolute m-auto inset-0 w-fit h-fit bg-white rounded-lg z-50">
							<CourseLink name={course.name} hours={parseInt(course.number[1])} requirementList={reqList}></CourseLink>
						</div>
					)}
					<div className={"w-full overflow-auto p-4 " + (mask ? "backdrop-brightness-70 brightness-70" : "")}>
						<TabGroup>
							<div className="flex flex-row justify-between relative">
								{/* "flex flex-row justify-between items-end bg-white w-full h-[55px] border" */}
								<TabList className="flex flex-row justify-between items-end border-2 rounded-lg w-80 max-lg:w-full overflow-hidden pt-1">
									{/* May have to change styling of focus:outline for accessibility */}
									<Tab as={Fragment}>
										{({ hover, selected }) => (
											<button className="flex flex-col items-center w-full focus:outline-0">
												<BookOpenIcon className={"size-6 " + clsx(selected && "stroke-[#e87500]")}></BookOpenIcon>
												Planner
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
												<ArrowTrendingUpIcon className={"size-6 " + clsx(selected && "stroke-[#e87500]")}></ArrowTrendingUpIcon>
												Flowchart
												<hr
													className={"size-1 w-full " + clsx(!selected && hover ? "opacity-50" : "")}
													color={clsx((selected || hover) && "#e87500")}
												/>
											</button>
										)}
									</Tab>
									<Tab as={Fragment}>
										{({ hover, selected }) => (
											<button className="flex flex-col items-center w-full focus:outline-0 lg:hidden">
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
											<button className="flex flex-col items-center w-full focus:outline-0 lg:hidden">
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
							</div>
							<TabPanels>
								<TabPanel>
									<PlannerWindow></PlannerWindow>
								</TabPanel>
								<TabPanel>
									<FlowchartWindow></FlowchartWindow>
								</TabPanel>
								<TabPanel>
									<RequirementWindow degreeName={degreePlan?.degreeName} degreeYear={degreePlan?.degreeYear}></RequirementWindow>
								</TabPanel>
								<TabPanel>
									<PrerequisiteWindow></PrerequisiteWindow>
								</TabPanel>
							</TabPanels>
						</TabGroup>
					</div>
				</div>
			</LinkContext.Provider>
		</>
	)
}

export default LargeWindow
