import { useContext, useEffect, useState } from "react"
import PlannerSection from "./PlannerSection"
import axios from "axios"
import { UserContext } from "../../../contexts/UserContext"
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react"
import { ChevronDownIcon } from "@heroicons/react/20/solid"
import { compareSemesters, getNextSemester, semesterFromDate } from "../../../utils/semester"

function PlannerWindow() {
	const { user } = useContext(UserContext)

	const [degreePlan, setDegreePlan] = useState(null)
	useEffect(() => {
		const fetchDegreePlan = async () => {
			try {
				if (!user) {
					return
				}
				const response = await axios.get(`http://localhost:3000/api/degreePlan/${user.DegreePlan.degreePlanID}`)
				setDegreePlan(response.data)
			} catch (error) {
				console.error("Error fetching degree plan:", error)
			}
		}
		fetchDegreePlan()
	}, [user])

	if (!degreePlan) {
		return <></>
	}

	const degreePlanCourses = Object.groupBy(degreePlan.DegreePlanCourses, (course) => {
		// test credit
		if (course.testComponentID) {
			return "Test Credits (AP/IB/CLEP/etc.)"
		}
		// transferred credit
		else if (course.externalCourseID) {
			return "Transferred Credits"
		}
		// semester credit
		else if (course.semesterTerm && course.semesterYear) {
			return `${course.semesterTerm} ${course.semesterYear}`
		} else {
			return "Future"
		}
	})

	const startSemester = { term: degreePlan.startSemesterTerm, year: degreePlan.startSemesterYear }
	const endSemester = { term: degreePlan.endSemesterTerm, year: degreePlan.endSemesterYear }
	const currentSemester = semesterFromDate(new Date())

	const pastSemesters = {}
	let semesterCounter = startSemester
	while (compareSemesters(semesterCounter, currentSemester) < 0) {
		pastSemesters[`${semesterCounter.term} ${semesterCounter.year}`] = degreePlanCourses[`${semesterCounter.term} ${semesterCounter.year}`] ?? []
		semesterCounter = getNextSemester(semesterCounter.term, parseInt(semesterCounter.year))
	}
	const currentAndFutureSemesters = {}
	currentAndFutureSemesters["Future"] = degreePlanCourses["Future"] ?? []
	while (compareSemesters(semesterCounter, endSemester) <= 0) {
		currentAndFutureSemesters[`${semesterCounter.term} ${semesterCounter.year}`] =
			degreePlanCourses[`${semesterCounter.term} ${semesterCounter.year}`] ?? []
		semesterCounter = getNextSemester(semesterCounter.term, parseInt(semesterCounter.year))
	}
	const testCredits = degreePlanCourses["Test Credits (AP/IB/CLEP/etc.)"] ?? []
	const transferredCredits = degreePlanCourses["Transferred Credits"] ?? []

	return (
		<>
			<Disclosure as="div" defaultOpen={true} className="mt-4">
				{({ open }) => (
					<>
						<DisclosureButton className="flex w-full justify-between rounded-lg bg-[#e87500] px-4 py-2 text-left text-sm font-medium text-white hover:bg-[#d06f00] focus:outline-none focus:ring-2 focus:ring-[#e87500] focus:ring-offset-2">
							<span>Current and Future Semesters</span>
							<ChevronDownIcon className="size-[24px]" />
						</DisclosureButton>
						<DisclosurePanel className="flex flex-col pt-4 gap-4">
							{Object.keys(currentAndFutureSemesters).map((section) => {
								return <PlannerSection name={section} courseList={currentAndFutureSemesters[section]}></PlannerSection>
							})}
						</DisclosurePanel>
					</>
				)}
			</Disclosure>
			<Disclosure as="div" className="mt-4">
				{({ open }) => (
					<>
						<DisclosureButton className="flex w-full justify-between rounded-lg bg-[#e87500] px-4 py-2 text-left text-sm font-medium text-white hover:bg-[#d06f00] focus:outline-none focus:ring-2 focus:ring-[#e87500] focus:ring-offset-2">
							<span>Past Semesters</span>
							<ChevronDownIcon className="size-[24px]" />
						</DisclosureButton>
						<DisclosurePanel className="flex flex-col pt-4 gap-4">
							{Object.keys(pastSemesters).map((section) => {
								return <PlannerSection name={section} courseList={pastSemesters[section]}></PlannerSection>
							})}
						</DisclosurePanel>
					</>
				)}
			</Disclosure>
			<Disclosure as="div" className="mt-4">
				{({ open }) => (
					<>
						<DisclosureButton className="flex w-full justify-between rounded-lg bg-[#e87500] px-4 py-2 text-left text-sm font-medium text-white hover:bg-[#d06f00] focus:outline-none focus:ring-2 focus:ring-[#e87500] focus:ring-offset-2">
							<span>Test and Transfer Credit</span>
							<ChevronDownIcon className="size-[24px]" />
						</DisclosureButton>
						<DisclosurePanel className="flex flex-col pt-4 gap-4">
							<PlannerSection name="Test Credits (AP/IB/CLEP/etc.)" courseList={testCredits}></PlannerSection>
							<PlannerSection name="Transferred Credits" courseList={transferredCredits}></PlannerSection>
						</DisclosurePanel>
					</>
				)}
			</Disclosure>
		</>
	)
}

export default PlannerWindow
