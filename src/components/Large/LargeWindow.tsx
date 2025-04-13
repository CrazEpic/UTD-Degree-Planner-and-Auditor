import { Tab, TabGroup, TabList, TabPanel, TabPanels, Menu, MenuButton, MenuItem, MenuItems  } from "@headlessui/react"
import { ArrowTrendingUpIcon, BookOpenIcon, Cog6ToothIcon } from "@heroicons/react/24/outline"
import PlannerWindow from "./Planner/PlannerWindow"
import FlowchartWindow from "./Flowchart/FlowchartWindow"
import CourseLink from "./CourseLink"
import { Block, Course } from "../../types/degreeTest"
import { LinkContext } from "../../contexts/LinkContext"
import { Fragment } from "react/jsx-runtime"
import clsx from 'clsx'

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

function click(message: string) {
	console.log(message)
}

function LargeWindow() {

	/* Implement linkCourse() and update masked and course
	const linkCourse = async () => {
		try {
			// API call
			// Update requirements
		} catch (error) {
			console.error("Error linking course:", error)
		}
	} 
	*/
	const linkCourse = () => {

	}
	

	const masked = false
	let course : Course = {
		prefix: "CR",
		number: "1234",
		name: "Course Name",
	}

	return (
		<>
			<LinkContext.Provider value={{course: null, linkCourse: linkCourse}}>
				<div className="w-full min-w-[375px] overflow-auto relative">
					{/* Make sure to make this the focus or bad things happen*/}
					{masked && 
						<div className="absolute m-auto inset-0 w-fit  h-fit bg-white rounded-lg z-50">
							<CourseLink name={course.name} hours={parseInt(course.number[1])} requirementList={reqList}></CourseLink>
						</div>
					}
					<div className={"w-full overflow-auto p-4 " + (masked ? "backdrop-brightness-70 brightness-70" : "")}>
						<TabGroup>
							<div className="flex flex-row justify-between relative">
								{/* "flex flex-row justify-between items-end bg-white w-full h-[55px] border" */}
								<TabList className="flex flex-row justify-between items-end border-2 rounded-lg w-80 bg-white overflow-hidden  pt-1">
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
								</TabList>
								{/* Feels like text should be here? 
										Or at least something should
										<p className="m-[15px] text-2xl">MY DEGREE PLAN</p> 
								*/}
								<Menu as="div" className="w-fit">
									<MenuButton className="hover:bg-blue-200">
										<Cog6ToothIcon className="size-8"></Cog6ToothIcon>
									</MenuButton>
									<MenuItems className="absolute right-0 border-2 rounded-lg bg-white flex flex-col z-10">
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
				</div>
			</LinkContext.Provider>
			
			
		</>
	)
}

export default LargeWindow