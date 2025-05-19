import { useContext, useEffect, useState } from "react"
import axios from "axios"
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react"
import { ChevronDownIcon } from "@heroicons/react/20/solid"
import PlannerSection from "./PlannerSection"
import { UserContext } from "../../../contexts/UserContext"
import { compareSemesters, getNextSemester, semesterFromDate, stringFromTerm } from "../../../utils/semester"
import { DegreePlan, DegreePlanCourse } from "../../../types/degree"

const PlannerWindow = ({
	degreePlanID
}: {
	degreePlanID: string
}) => {
	// User could be undefined because of the ?
	const user = useContext(UserContext)?.user

	const [degreePlan, setDegreePlan] = useState<DegreePlan | null>(null)

	const fetchDegreePlan = async () => {
		try {
			if (!user) {
				return
			}

			// Update with degreePlanID
			const response = await axios.get(`/api/degreePlan/${degreePlanID}`)
			setDegreePlan(response.data)
		} catch (error) {
			console.error("Error fetching degree plan:", error)
		}
	}

	useEffect(() => {
		fetchDegreePlan()
	}, [user])

	if (!degreePlan) {
		return <></>
	}

	const degreePlanCourses = Object.groupBy(degreePlan.DegreePlanCourses, (course: DegreePlanCourse) => {
		// test credit
		if (course.testComponentID) {
			return "Test Credits (AP/IB/CLEP/etc.)"
		}
		// transferred credit
		else if (course.transferCourseEquivalencyID) {
			return "Transferred Credits"
		}
		// semester credit
		else if (course.semesterTerm && course.semesterYear) {
			return `${course.semesterTerm} ${course.semesterYear}`
		} else {
			return "Future"
		}
	})

	const startSemester = { term: degreePlan.startSemesterTerm, year: parseInt(degreePlan.startSemesterYear) }
	const endSemester = { term: degreePlan.endSemesterTerm, year: parseInt(degreePlan.endSemesterYear) }
	const currentSemester = semesterFromDate(new Date())

	const pastSemesters: any = {}
	let semesterCounter = startSemester
	while (compareSemesters(semesterCounter, currentSemester) < 0) {
		pastSemesters[`${stringFromTerm(semesterCounter.term)} ${semesterCounter.year}`] =
			degreePlanCourses[`${stringFromTerm(semesterCounter.term)} ${semesterCounter.year}`] ?? []
		semesterCounter = getNextSemester(semesterCounter.term, semesterCounter.year)
	}
	let currentAndFutureSemesters: any = {}
	currentAndFutureSemesters["Future"] = degreePlanCourses["Future"] ?? []
	while (compareSemesters(semesterCounter, endSemester) <= 0) {
		currentAndFutureSemesters[`${stringFromTerm(semesterCounter.term)} ${semesterCounter.year}`] =
			degreePlanCourses[`${stringFromTerm(semesterCounter.term)} ${semesterCounter.year}`] ?? []
		semesterCounter = getNextSemester(semesterCounter.term, semesterCounter.year)
	}
	const testCredits = degreePlanCourses["Test Credits (AP/IB/CLEP/etc.)"] ?? []
	const transferredCredits = degreePlanCourses["Transferred Credits"] ?? []

	return (
		<>
			<Disclosure as="div" defaultOpen={true} className="mt-4">
				{({ open }) => (
					<>
						<DisclosureButton className="flex w-full items-center justify-between rounded-lg bg-[#e87500] px-4 py-2 text-left text-sm font-medium text-white hover:bg-[#d06f00] focus:outline-none focus:ring-2 focus:ring-[#e87500] focus:ring-offset-2">
							<span>Current and Future Semesters</span>
							<ChevronDownIcon className="size-8" />
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
						<DisclosureButton className="flex w-full items-center justify-between rounded-lg bg-[#e87500] px-4 py-2 text-left text-sm font-medium text-white hover:bg-[#d06f00] focus:outline-none focus:ring-2 focus:ring-[#e87500] focus:ring-offset-2">
							<span>Past Semesters</span>
							<ChevronDownIcon className="size-8" />
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
						<DisclosureButton className="flex w-full items-center justify-between rounded-lg bg-[#e87500] px-4 py-2 text-left text-sm font-medium text-white hover:bg-[#d06f00] focus:outline-none focus:ring-2 focus:ring-[#e87500] focus:ring-offset-2">
							<span>Test and Transfer Credit</span>
							<ChevronDownIcon className="size-8" />
						</DisclosureButton>
						<DisclosurePanel className="flex flex-col pt-4 gap-4">
							<PlannerSection name="Test Credits (AP/IB/CLEP/etc.)" courseList={testCredits} fetchDegree={fetchDegreePlan}></PlannerSection>
							<PlannerSection name="Transferred Credits" courseList={transferredCredits} fetchDegree={fetchDegreePlan}></PlannerSection>
						</DisclosurePanel>
					</>
				)}
			</Disclosure>
		</>
	)
}

export default PlannerWindow
