import cytoscape from "cytoscape"
import dagre from "cytoscape-dagre"
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/solid"
import { UserContext } from "../../../contexts/UserContext"
import { useEffect, useContext, useState } from "react"
import axios from "axios"
import { compareSemesters, getNextSemester, semesterFromDate } from "../../../utils/semester"

/*
Steps:
Get all courses with credit received
Get all future courses in planner
Resolve all block ambiguity in the planner
-> Get all courses in the degree
Fulfill all requisites to the best of your ability
while unresolved requisites
	Resolve all ambiguous requisites
	Fetch all missing requisite courses if needed 
display flowchart
*/

cytoscape.use(dagre)

let cy: cytoscape.Core

const FlowchartCytoscape = () => {
	// TODO: I WILL FIX WHERE I API CALL LATER BUT I JUST NEED THE INFORMATION
	const { user } = useContext(UserContext)
	const [degreePlan, setDegreePlan] = useState(null)

	useEffect(() => {
		if (!user) {
			return
		}

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
		if (!degreePlan) {
			fetchDegreePlan()
			return
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

		const creditReceived = new Set(
			testCredits
				.map((course) => `${course.prefix} ${course.number}`)
				.concat(transferredCredits.map((course) => `${course.prefix} ${course.number}`))
				.concat(
					Object.keys(pastSemesters).flatMap((key) => {
						return pastSemesters[key].map((degreePlanCourse) => `${degreePlanCourse.prefix} ${degreePlanCourse.number}`)
					})
				)
		)

		const coursesNeeded = {}
		Object.keys(currentAndFutureSemesters).forEach((key) => {
			currentAndFutureSemesters[key].forEach((degreePlanCourse) => {
				if (!creditReceived.has(`${degreePlanCourse.prefix} ${degreePlanCourse.number}`)) {
					coursesNeeded[`${degreePlanCourse.prefix} ${degreePlanCourse.number}`] = {
						requisites: degreePlanCourse.Course.requisites,
						neededRequisiteCourses: [],
					}
				}
			})
		})

		// TODO: pretend I fulfilled all block ambiguity :)

		/*
			try to fulfill all requisites
		*/


		const nodes = Object.keys(coursesNeeded).map((course) => {
			return { data: { id: course } }
		})

		cy = cytoscape({
			container: document.getElementById("cy"),
			elements: nodes,
			style: [
				// the stylesheet for the graph
				{
					selector: "node",
					style: {
						"background-color": "#000000",
						content: "data(id)",
						shape: "round-rectangle",
						width: "125px",
						backgroundColor: "#FFFFFF",
						"border-width": 2,
						padding: "10px",
					},
				},
			],
			layout: {
				name: "dagre",
				// @ts-expect-error: dagre import is not typed here
				nodeDimensionsIncludeLabels: true,
			},
		})
	}, [degreePlan, user])

	return (
		<>
			<div className="relative h-[75vh] border-4 border-black m-10">
				<div id="cy" className="w-full h-full"></div>
			</div>
		</>
	)
}

export default FlowchartCytoscape
