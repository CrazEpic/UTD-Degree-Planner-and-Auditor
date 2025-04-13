import cytoscape from "cytoscape"
import dagre from "cytoscape-dagre"
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/solid"
import { UserContext } from "../../../contexts/UserContext"
import { useEffect, useContext, useState } from "react"
import axios from "axios"
import { compareSemesters, getNextSemester, semesterFromDate } from "../../../utils/semester"
import ChooseRequisiteWrapper from "./Requisites/ChooseRequisiteWrapper"

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
	const [unfulfilledRequisites, setUnfulfilledRequisites] = useState<{ course: string; requisites: any }[]>([])

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
		// add selected property to all requisites so we can attempt to fulfill them
		Object.keys(currentAndFutureSemesters).forEach((key) => {
			currentAndFutureSemesters[key].forEach((degreePlanCourse) => {
				if (!creditReceived.has(`${degreePlanCourse.prefix} ${degreePlanCourse.number}`)) {
					const recursivelyAddSelected = (requisites) => {
						if (Object.hasOwn(requisites, "type")) {
							requisites["selected"] = false
						} else if (Object.hasOwn(requisites, "logicalOperator")) {
							requisites.requisites.forEach((requisite) => {
								recursivelyAddSelected(requisite)
							})
						}
					}
					const prerequisites = degreePlanCourse.Course.requisites.prequisites
					recursivelyAddSelected(prerequisites)
					const corequisites = degreePlanCourse.Course.requisites.corequisites
					recursivelyAddSelected(corequisites)
					const prerequisitesOrCorequisites = degreePlanCourse.Course.requisites.prerequisitesOrCorequisites
					recursivelyAddSelected(prerequisitesOrCorequisites)
					coursesNeeded[`${degreePlanCourse.prefix} ${degreePlanCourse.number}`] = {
						requisites: {
							prerequisites: prerequisites,
							corequisites: corequisites,
							prerequisitesOrCorequisites: prerequisitesOrCorequisites,
						},
					}
				}
			})
		})

		console.log(coursesNeeded)

		// TODO: pretend I fulfilled all block ambiguity :)

		/*
			try to get a neededcourse to fulfill all requisites
		*/

		const tryToFulfillBranch = (requisites) => {
			if (Object.hasOwn(requisites, "logicalOperator")) {
				// has branches
				if (requisites.logicalOperator === "AND") {
					return requisites.requisites.every((requisite) => tryToFulfillBranch(requisite))
				} else if (requisites.logicalOperator === "OR") {
					return requisites.requisites.some((requisite) => tryToFulfillBranch(requisite))
				}
			} else if (Object.hasOwn(requisites, "type")) {
				// reached a leaf requisite, check fulfillment
				switch (requisites.type) {
					case "course":
						// check if course is in credit received or current/future/has been added temporarily
						return creditReceived.has(requisites.courseID) || Object.hasOwn(coursesNeeded, requisites.courseID)
					case "matcher":
						// try to fulfill with received credit before checking current/future/temporary
						Array.from(creditReceived).find((course) => {
							// check if course is in match list
							if (requisites.matchList != null && Array.isArray(requisites.matchList) && !requisites.matchList.includes(course)) {
								return false
							} else if (requisites.matchList != null && typeof requisites.matchList === "string" && requisites.matchList !== course) {
								return false
							}
							// check if course meets conditions
							if (requisites.condition.prefix != null && requisites.condition.prefix !== course.split(" ")[0]) {
								return false
							}
							if (requisites.condition.level != null) {
								const courseLevel = course.split(" ")[1].slice(0, 1) // get first digit of course number
								let courseLevelString = ""
								switch (courseLevel) {
									case "1":
										courseLevelString = "1000"
										break
									case "2":
										courseLevelString = "2000"
										break
									case "3":
										courseLevelString = "3000"
										break
									case "4":
										courseLevelString = "4000"
										break
								}
								if (requisites.condition.level === "UPPER_DIVISION") {
									if (courseLevelString !== "3000" && courseLevelString !== "4000") {
										return false
									}
								} else if (courseLevelString !== requisites.condition.level) {
									return false
								}
							}
							// haven't check minGrade or minCreditHours yet
							return true
						})
						// type: "matcher"
						// 	matchList?: string[] | string
						// 	condition: {
						// 		prefix?: string
						// 		level?: CourseLevel
						// 		minGrade?: string
						// 		minCreditHours?: number
						// 	}
						break
					case "major":
						break
					case "minor":
						break
					case "custom":
						break
					default:
						console.error("Unknown requisite type:", requisites.type)
						return false
				}
			} else {
				// empty requisite
				return true
			}
		}

		// try to fulfill all requisites

		console.log("Trying to fulfill requisites...")
		Object.keys(coursesNeeded).forEach((course) => {
			const requisites = coursesNeeded[course].requisites
			if (requisites) {
				// console.log(`Trying to fulfill requisites for ${course}...`)
				const prerequisites = requisites.prerequisites
				// console.log("Prerequisites:", prerequisites)
				if (prerequisites) {
					const fulfilled = tryToFulfillBranch(prerequisites)
					if (fulfilled) {
						// console.log(`Prerequisites for ${course} fulfilled!`)
					} else {
						// console.log(`Prerequisites for ${course} not fulfilled!`)
						setUnfulfilledRequisites((prev) => [
							...prev,
							{
								course: course,
								requisites: prerequisites,
							},
						])
					}
				}
			}
		})

		// we can only try to fulfill course or matcher requisites, and check major/minor requisites
		const major = degreePlan.degreeName

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
				<div className="absolute top-0 border-black border-2 w-full h-full bg-white overflow-y-scroll">
					<p>Requisites</p>
					{unfulfilledRequisites.map((requisite) => {
						return (
							<>
								<p>{requisite.course}</p>
								<ChooseRequisiteWrapper requisites={requisite.requisites} />
								<hr></hr>
							</>
						)
					})}
				</div>
			</div>
		</>
	)
}

export default FlowchartCytoscape
