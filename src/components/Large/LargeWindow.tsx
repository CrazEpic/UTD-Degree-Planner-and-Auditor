import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react"
import { AcademicCapIcon, ArrowTrendingUpIcon, BookOpenIcon, KeyIcon } from "@heroicons/react/24/outline"
import PlannerWindow from "./Planner/PlannerWindow"
import FlowchartWindow from "./Flowchart/FlowchartWindow"
import CourseLinkModal from "./CourseLinkModal"
import { Block, Course, UserContextType } from "../../types/degreeTest"
import { UserContext } from "../../contexts/UserContext"
import { Fragment } from "react/jsx-runtime"
import clsx from "clsx"
import { useContext, useState } from "react"
import RequirementWindow from "../Small/Requirements/RequirementWindow"
import PrerequisiteWindow from "../Small/Prerequisites/PrerequisiteWindow"
import { createDefaultBlock } from "../../utils/degreeParsing"
import CreditModal from "./CreditModalTest/CreditModal" // Update back to CreditModal
import { ModalContext } from "../../contexts/ModalContext"

const reqList: Block[] = [createDefaultBlock(), createDefaultBlock(), createDefaultBlock()]

function LargeWindow() {

	const user = (useContext(UserContext) as UserContextType).user

	// 	Mask information for modals
	const [mask, setMask] = useState(false)
	const [modalType, setModalType] = useState<string | null>(null)
	const openModal = (type: string) => {
		setMask(true)
		setModalType(type)
	}
	const closeModal = () => {
		setMask(false)
		setModalType(null)
	}

	/* 	Implement linkCourse()
	const linkCourse = async () => {
		try {
			// Find matching requirements API
		} catch (error) {
			console.error("Error fetching requirements:", error)
		}
	} 
	*/
	const [course, setCourse] = useState<Course>()
	const linkCourse = (course: Course) => {
		openModal("LINK")
		setCourse(course)
	}

	// May want to take the test and transfer credit functions to a util
	const [creditType, setCreditType] = useState("")
	const findCredit = (type: string) => {
		openModal("CREDIT")
		setCreditType(type)
	}

	return (
		<>
			<div className={"relative w-full " + (mask ? "overflow-hidden" : "overflow-auto")}>
				{/* Please put these modals in focus when they appear */}
				{mask &&
					<div className="absolute w-fit">
						{modalType === "LINK" ? (
							// Course linking window
							<div className="fixed lg:top-[calc((100vh-55px)/2)] lg:left-[calc((100vw-375px)/2)] max-lg:top-1/2 max-lg:left-1/2 -translate-1/2 w-fit h-fit bg-white rounded-lg z-50">
								<CourseLinkModal name={course.name} hours={parseInt(course.number[1])} requirementList={reqList} close={closeModal}></CourseLinkModal>
							</div>
						) : (
							// Test and transfer credit window
							<div className="fixed lg:top-[calc((100vh-55px)/2)] lg:left-[calc((100vw-375px)/2)] max-lg:top-1/2 max-lg:left-1/2 -translate-1/2 w-fit h-fit bg-white rounded-lg z-50">
								<CreditModal type={creditType} close={closeModal}></CreditModal>
							</div>
						)}
					</div>
				}
				<div className={"w-full overflow-auto p-4 " + (mask ? "backdrop-brightness-70 brightness-70" : "")}>
					<TabGroup>
						<div className="flex flex-row justify-between relative">
							{/* "flex flex-row justify-between items-end bg-white w-full h-[55px] border" */}
							<TabList className="flex flex-row justify-between items-end border-2 rounded-lg w-80 max-lg:w-full overflow-hidden pt-1">

								{/* May have to change styling of focus:outline for accessibility */}
								<Tab as={Fragment}>
									{({ hover, selected}) => (
										<button className="flex flex-col items-center w-full focus:outline-0">
											<BookOpenIcon className={"size-6 " + clsx(selected && "stroke-[#e87500]")}></BookOpenIcon>
											Planner
											<hr className={"size-1 w-full " + clsx((!selected && hover) ? "opacity-50" : "")} color={clsx((selected || hover) && "#e87500")}/>
										</button>
									)}
								</Tab>
								<Tab as={Fragment}>
									{({ hover, selected}) => (
										<button className="flex flex-col items-center w-full focus:outline-0">
											<ArrowTrendingUpIcon className={"size-6 " + clsx(selected && "stroke-[#e87500]")}></ArrowTrendingUpIcon>
											Flowchart
											<hr className={"size-1 w-full " + clsx((!selected && hover) ? "opacity-50" : "")} color={clsx((selected || hover) && "#e87500")}/>
										</button>
									)}
								</Tab>
								<Tab as={Fragment}>
									{({ hover, selected}) => (
										<button className="flex flex-col items-center w-full focus:outline-0 lg:hidden">
											<AcademicCapIcon className={"size-6 " + clsx(selected && "stroke-[#e87500]")}></AcademicCapIcon>
											Degree
											<hr className={"size-1 w-full " + clsx((!selected && hover) ? "opacity-50" : "")} color={clsx((selected || hover) && "#e87500")}/>
										</button>
									)}
								</Tab> 
								<Tab as={Fragment}>
									{({ hover, selected}) => (
										<button className="flex flex-col items-center w-full focus:outline-0 lg:hidden">
											<KeyIcon className={"size-6 " + clsx(selected && "stroke-[#e87500]")}></KeyIcon>
											Prereqs
											<hr className={"size-1 w-full " + clsx((!selected && hover) ? "opacity-50" : "")} color={clsx((selected || hover) && "#e87500")}/>
										</button>
									)}
								</Tab> 
							</TabList>
						</div>
						<TabPanels>
							<TabPanel>
								<ModalContext.Provider value={{linkCourse: linkCourse, findCredit: findCredit}}>
									<PlannerWindow></PlannerWindow>
								</ModalContext.Provider>
							</TabPanel>
							<TabPanel>
								<FlowchartWindow></FlowchartWindow>
							</TabPanel>
							<TabPanel>
								<RequirementWindow degreeName={user?.DegreePlan?.degreeName} degreeYear={user?.DegreePlan?.degreeYear}></RequirementWindow>
							</TabPanel>
							<TabPanel>
								<PrerequisiteWindow></PrerequisiteWindow>
							</TabPanel>
						</TabPanels>
					</TabGroup>
				</div>
			</div>
		</>
	)
}

export default LargeWindow
