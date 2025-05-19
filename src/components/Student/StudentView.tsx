import { Fragment, useContext, useEffect, useState } from "react"
import clsx from "clsx"
import { Tab, TabGroup, TabList, TabPanel, TabPanels, Combobox, ComboboxOptions, ComboboxOption, ComboboxInput } from "@headlessui/react"
import { AcademicCapIcon, ArrowTrendingUpIcon, BookOpenIcon, KeyIcon } from "@heroicons/react/24/outline"
import CourseLinkModal from "./Modals/CourseLink/CourseLinkModal"
import CreditModal from "./Modals/Credit/CreditModal"
import PlannerWindow from "./Planner/PlannerWindow"
import FlowchartWindow from "./Flowchart/FlowchartWindow"
import RequirementWindow from "./Requirements/RequirementWindow"
import PrerequisiteWindow from "./Prerequisites/PrerequisiteWindow"
import SearchWindow from "./SearchWindow"
import { MatcherContext } from "../../contexts/MatcherContext"
import { UserContext } from "../../contexts/UserContext"
import { ModalContext } from "../../contexts/ModalContext"
import { Course, Degree, DegreePlan } from "../../types/degree"
import axios from "axios"

const StudentView = () => {
	const user = useContext(UserContext)?.user

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

	const [course, setCourse] = useState<Course>()
	const linkCourse = (course: Course) => {
		openModal("LINK")
		setCourse(course)
	}

	const [creditType, setCreditType] = useState("")
	const findCredit = (type: string) => {
		openModal("CREDIT")
		setCreditType(type)
	}

	// Ensures the right tabs/panels are visible for different screen sizes
	const [tabIndex, setTabIndex] = useState(0)
	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth >= 1024 && tabIndex >= 2) {
				setTabIndex(0)
			}
		}
		window.addEventListener("resize", handleResize)
		return () => window.removeEventListener("resize", handleResize)
	}, [tabIndex])

	const conditions = {}
	const [matcher, setMatcher] = useState(false)

	// currently a string, but could be different later
	const searchCourses = (matcher: string) => {
		setMatcher(true)
		console.log(matcher)
		// modify conditions in here
	}

	const endSearch = () => {
		setMatcher(false)
	}

	const [degrees, setDegrees] = useState([])
	const [degreeInfo, setDegreeInfo] = useState({
		degreeName: "Computer Science",
		degreeYear: 2025,
	})
	const [query, setQuery] = useState("")
	const [selectedDegreePlan, setSelectedDegreePlan] = useState<DegreePlan | null>()

	// Undefined Undefined (can be fixed with timeout + placeholder info)
	const fetchDegrees = async () => {
		try {
			const response = await axios.get("/api/degree/degrees")
			setDegrees(response.data)
		} catch (error) {
			console.error("Getting degrees failed", error)
		}
	}

	const updateDegreePlan = async () => {
		// Check if the plan is already in the database
		// Degree.DegreePlan exists?

		/*
        if (plan already exists) {
            then select that plan
        }
        */

		// Template
		if (degreeInfo.degreeName === "Computer Science") {
		} else {
			try {
				const response = await axios.post("/api/degreePlan/changeDegreePlan", {
					degreePlanID: user?.DegreePlan?.degreePlanID as string,
					newDegree: {
						degreeName: degreeInfo.degreeName as string,
						degreeYear: degreeInfo.degreeYear,
					},
				})
			} catch (error) {
				console.error("Creating degree plan failed", error)
			}

			// else (create a new plan and switch to that)
			// try {
			//     const response = await axios.get(`/api/degreePlan`, {
			//         userID: user?.userID as string,
			//         degreeID: {
			//             degreeName: degreeInfo.degreeName as string,
			//             degreeYear: degreeInfo.degreeYear,
			//         },
			//         name: "New " + degreeInfo.degreeName + degreeInfo.degreeYear as string,
			//     })
			//     setSelectedDegreePlan(response.data)
			// } catch (error) {
			//     console.error("Creating degree plan failed", error)
			// }
		}
	}

	useEffect(() => {
		fetchDegrees()
		updateDegreePlan()
	}, [degreeInfo])

	const renderDegreeDropdown = () => {
		return (
			<>
				{/* Search for a degree already in the list */}
				<Combobox
					as="div"
					value={degreeInfo}
					onChange={(value) => {
						if (value) {
							setDegreeInfo(value)
						}
					}}
					by={(degreeA, degreeB) => {
						return degreeA.degreeName === degreeB.degreeName && degreeA.degreeYear === degreeB.degreeYear
					}}
					className="w-50"
				>
					<div>
						<ComboboxInput
							onChange={(event) => {
								setQuery(event.target.value)
							}}
							displayValue={(degree: Degree) => {
								if (degree.degreeName === "" && parseInt(degree.degreeYear) === -1) {
									return ""
								}
								return degree.degreeName + " " + degree.degreeYear
							}}
							placeholder="Search for a degree"
							className="border-2 border-black rounded-md p-2 h-10 mb-1"
						></ComboboxInput>
						<ComboboxOptions static className="border-black border-2 rounded-md">
							{degrees
								.filter((degree: Degree) => {
									return `${degree.degreeName} + " " + ${degree.degreeYear}`.toLowerCase().includes(query.toLowerCase())
								})
								.map((degree: Degree) => {
									return (
										<ComboboxOption
											key={degree.degreeName + " " + degree.degreeYear}
											value={degree}
											className="hover:bg-gray-200 cursor-pointer px-2 rounded-md"
										>
											{degree.degreeName + " " + degree.degreeYear}
										</ComboboxOption>
									)
								})}
						</ComboboxOptions>
					</div>
				</Combobox>
			</>
		)
	}

	return (
		<>
			<div className="flex flex-row h-[calc(100vh-55px)]">
				{/* "Large Window" */}
				<div className={"relative w-full " + (mask ? "overflow-hidden" : "overflow-auto")}>
					{/* TODO: Put modals in focus when they appear */}
					{mask && (
						<div className="absolute w-fit">
							{modalType === "LINK" ? (
								// Course linking window
								<div className="fixed lg:top-[calc((100vh-55px)/2)] lg:left-[calc((100vw-375px)/2)] max-lg:top-1/2 max-lg:left-1/2 -translate-1/2 w-fit h-fit bg-white rounded-lg z-50">
									<CourseLinkModal course={course as Course} close={closeModal}></CourseLinkModal>
								</div>
							) : (
								// Test and transfer credit window
								<div className="fixed lg:top-[calc((100vh-55px)/2)] lg:left-[calc((100vw-375px)/2)] max-lg:top-1/2 max-lg:left-1/2 -translate-1/2 w-fit h-fit bg-white rounded-lg z-50">
									<CreditModal type={creditType} close={closeModal}></CreditModal>
								</div>
							)}
						</div>
					)}
					<div className={"w-full overflow-auto p-4 " + (mask ? "backdrop-brightness-70 brightness-70" : "")}>
						<TabGroup selectedIndex={tabIndex} onChange={setTabIndex}>
							<div className="flex flex-row justify-between gap-2 relative">
								<TabList className="flex flex-row justify-between items-end border-2 rounded-lg w-80 h-fit max-lg:w-full overflow-hidden pt-1">
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
								<div className="">{renderDegreeDropdown()}</div>
							</div>
							<TabPanels>
								<TabPanel>
									<ModalContext.Provider value={{ linkCourse: linkCourse, findCredit: findCredit }}>
										<PlannerWindow
											degreePlanID={selectedDegreePlan?.degreePlanID ?? (user?.DegreePlan?.degreePlanID as string)}
										></PlannerWindow>
									</ModalContext.Provider>
								</TabPanel>
								<TabPanel>
									<FlowchartWindow></FlowchartWindow>
								</TabPanel>
								<div className="lg:hidden">
									<TabPanel>
										<RequirementWindow
											degreeName={user?.DegreePlan?.degreeName as string}
											degreeYear={user?.DegreePlan?.degreeYear as string}
											mode={"NORMAL"}
										></RequirementWindow>
									</TabPanel>
									<TabPanel>
										<PrerequisiteWindow></PrerequisiteWindow>
									</TabPanel>
								</div>
							</TabPanels>
						</TabGroup>
					</div>
				</div>

				{/* "Small Window" */}
				<div className="max-lg:hidden">
					<MatcherContext.Provider value={{ conditions: null, search: searchCourses, close: endSearch }}>
						{matcher ? (
							<SearchWindow conditions={conditions} />
						) : (
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
												<RequirementWindow
													degreeName={user?.DegreePlan?.degreeName as string}
													degreeYear={user?.DegreePlan?.degreeYear as string}
													mode={"NORMAL"}
												></RequirementWindow>
											</TabPanel>
											<TabPanel>
												<PrerequisiteWindow></PrerequisiteWindow>
											</TabPanel>
										</TabPanels>
									</TabGroup>
								</div>
							</>
						)}
					</MatcherContext.Provider>
				</div>
			</div>
		</>
	)
}

export default StudentView
