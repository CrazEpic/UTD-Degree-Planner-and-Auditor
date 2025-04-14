import cytoscape from "cytoscape"
import dagre from "cytoscape-dagre"
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/solid"
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react"
import { UserContext } from "../../../contexts/UserContext"
import { useEffect, useContext, useState } from "react"
import axios from "axios"
import { compareSemesters, getNextSemester, semesterFromDate, stringFromTerm } from "../../../utils/semester"
import ChooseRequisite from "./Requisites/ChooseRequisite"

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
	// temporarilyAddedCourses will be affected by requisite selector
	const [temporarilyAddedCourses, setTemporarilyAddedCourses] = useState([])
	// temporarilySelectedCustomRequisites will be affected by requisite selector, where the value is a path to the custom requisite
	const [temporarilySelectedCustomRequisites, setTemporarilySelectedCustomRequisites] = useState([])
	const [coursesRequisitesNeededFinal, setCoursesRequisitesNeededFinal] = useState({})
	const [canDisplayFlowchart, setCanDisplayFlowchart] = useState(false)
	const [mostImportantCoursesThatCanBeTaken, setMostImportantCoursesThatCanBeTaken] = useState([])

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

		console.log(pastSemesters)

		const creditReceived = new Set(
			testCredits
				.map((course) => `${course.prefix} ${course.number}`)
				.concat(transferredCredits.map((course) => `${course.prefix} ${course.number}`))
				.concat(
					Object.keys(pastSemesters).flatMap((key) => {
						return pastSemesters[key].flatMap((degreePlanCourse) => {
							console.log(degreePlanCourse)
							return `${degreePlanCourse.prefix} ${degreePlanCourse.number}`
						})
					})
				)
		)

		console.log(creditReceived)

		const coursesRequisitesNeeded = Object.keys(currentAndFutureSemesters)
			.flatMap((key) => {
				return currentAndFutureSemesters[key].map((degreePlanCourse) => {
					return {
						prefix: degreePlanCourse.prefix,
						number: degreePlanCourse.number,
						requisites: degreePlanCourse.Course.requisites,
					}
				})
			})
			.concat(temporarilyAddedCourses)
			.reduce((acc, course) => {
				acc[`${course.prefix} ${course.number}`] = { requisites: course.requisites }
				return acc
			}, {})

		// add canBeFulfilled property to all requisites so we can attempt to fulfill them
		// togglable property is for the user to select which requisites they want to fulfill
		// untogglable means that the course is already in the planner and cannot be toggled off (not temporary)
		const compareArrays = (a, b) => a.length === b.length && a.every((element, index) => element === b[index])
		Object.keys(coursesRequisitesNeeded).forEach((course) => {
			const recursivelyAddCanBeFulfilled = (requisites, path) => {
				if (Object.hasOwn(requisites, "type")) {
					// reached a leaf requisite, check fulfillment
					requisites.canBeFulfilled = false
					requisites.togglable = true

					switch (requisites.type) {
						case "course":
							// check if course is in credit received or current/future/has been added temporarily
							requisites.canBeFulfilled = creditReceived.has(requisites.courseID) || Object.hasOwn(coursesRequisitesNeeded, requisites.courseID)
							// if this is true, set togglable to false
							if (
								creditReceived.has(requisites.courseID) ||
								Object.keys(currentAndFutureSemesters)
									.flatMap((key) => {
										return currentAndFutureSemesters[key].map((degreePlanCourse) => {
											return {
												prefix: degreePlanCourse.prefix,
												number: degreePlanCourse.number,
												requisites: degreePlanCourse.Course.requisites,
											}
										})
									})
									.find((course) => {
										return course.prefix == requisites.courseID.split(" ")[0] && course.number == requisites.courseID.split(" ")[1]
									})
							) {
								requisites.togglable = false
							}
							break
						case "matcher":
							// try to fulfill with received credit before checking current/future/temporary
							// Array.from(creditReceived).find((course) => {
							// 	// check if course is in match list
							// 	if (requisites.matchList != null && Array.isArray(requisites.matchList) && !requisites.matchList.includes(course)) {
							// 		return false
							// 	} else if (
							// 		requisites.matchList != null &&
							// 		typeof requisites.matchList === "string" &&
							// 		requisites.matchList !== course
							// 	) {
							// 		return false
							// 	}
							// 	// check if course meets conditions
							// 	if (requisites.condition.prefix != null && requisites.condition.prefix !== course.split(" ")[0]) {
							// 		return false
							// 	}
							// 	if (requisites.condition.level != null) {
							// 		const courseLevel = course.split(" ")[1].slice(0, 1) // get first digit of course number
							// 		let courseLevelString = ""
							// 		switch (courseLevel) {
							// 			case "1":
							// 				courseLevelString = "1000"
							// 				break
							// 			case "2":
							// 				courseLevelString = "2000"
							// 				break
							// 			case "3":
							// 				courseLevelString = "3000"
							// 				break
							// 			case "4":
							// 				courseLevelString = "4000"
							// 				break
							// 		}
							// 		if (requisites.condition.level === "UPPER_DIVISION") {
							// 			if (courseLevelString !== "3000" && courseLevelString !== "4000") {
							// 				return false
							// 			}
							// 		} else if (courseLevelString !== requisites.condition.level) {
							// 			return false
							// 		}
							// 	}
							// haven't check minGrade or minCreditHours yet
							// return true
							// })
							break
						case "major":
							break
						case "minor":
							break
						case "custom":
							if (temporarilySelectedCustomRequisites.find((elementPath) => compareArrays(elementPath, path))) {
								requisites.canBeFulfilled = true
							}
							break
						default:
							console.error("Unknown requisite type:", requisites.type)
							return false
					}
				} else if (Object.hasOwn(requisites, "logicalOperator")) {
					requisites.requisites.forEach((requisite, index) => {
						recursivelyAddCanBeFulfilled(requisite, [...path, "requisites", index])
					})
				}
			}
			const prerequisites = coursesRequisitesNeeded[course].requisites.prerequisites
			const corequisites = coursesRequisitesNeeded[course].requisites.corequisites
			const prerequisitesOrCorequisites = coursesRequisitesNeeded[course].requisites.prerequisitesOrCorequisites
			recursivelyAddCanBeFulfilled(prerequisites, [course, "requisites", "prerequisites"])
			recursivelyAddCanBeFulfilled(corequisites, [course, "requisites", "corequisites"])
			recursivelyAddCanBeFulfilled(prerequisitesOrCorequisites, [course, "requisites", "prerequisitesOrCorequisites"])
		})

		setCoursesRequisitesNeededFinal(coursesRequisitesNeeded)

		// TODO: pretend I fulfilled all block ambiguity :)

		// we can only try to fulfill course or matcher requisites, and check major/minor requisites
		// const major = degreePlan.degreeName

		// if all requisites are fulfilled, can display flowchart
		const tryToFulfillBranchViaCanBeFulfilled = (requisites) => {
			if (Object.hasOwn(requisites, "logicalOperator")) {
				// has branches
				if (requisites.logicalOperator === "AND") {
					return requisites.requisites.every((requisite) => tryToFulfillBranchViaCanBeFulfilled(requisite))
				} else if (requisites.logicalOperator === "OR") {
					return requisites.requisites.some((requisite) => tryToFulfillBranchViaCanBeFulfilled(requisite))
				}
			} else if (Object.hasOwn(requisites, "type")) {
				// reached a leaf requisite, check fulfillment
				return requisites.canBeFulfilled
			} else {
				// empty requisite
				return true
			}
		}

		setCanDisplayFlowchart(
			Object.keys(coursesRequisitesNeeded).every((course) => {
				return Object.keys(coursesRequisitesNeeded[course].requisites).every((requisiteType) => {
					return tryToFulfillBranchViaCanBeFulfilled(coursesRequisitesNeeded[course].requisites[requisiteType])
				})
			})
		)

		if (!canDisplayFlowchart) {
			return
		}

		const nodes = Object.keys(coursesRequisitesNeeded).map((course) => {
			if (
				temporarilyAddedCourses.find((c) => {
					return c.prefix == course.split(" ")[0] && c.number == course.split(" ")[1]
				})
			) {
				return { data: { id: course, class: "temporarilyAdded" } }
			} else {
				return { data: { id: course } }
			}
		})

		const requisiteEdges = Object.keys(coursesRequisitesNeeded).flatMap((course) => {
			// get all needed courses from requisites
			const getRequisiteEdges = (requisites, requisiteType) => {
				if (Object.hasOwn(requisites, "logicalOperator")) {
					return requisites.requisites.flatMap((requisite) => getRequisiteEdges(requisite, requisiteType))
				} else if (Object.hasOwn(requisites, "type")) {
					if (requisites.type == "course" && requisites.canBeFulfilled && requisites.togglable) {
						return [
							{
								data: {
									id: `${requisiteType}:${requisites.courseID}-${course}`,
									source: requisites.courseID,
									target: course,
									class: requisiteType,
								},
							},
						]
					} else {
						return []
					}
				} else {
					return []
				}
			}
			return Object.keys(coursesRequisitesNeeded[course].requisites).flatMap((requisiteType) => {
				return getRequisiteEdges(coursesRequisitesNeeded[course].requisites[requisiteType], requisiteType)
			})
		})

		cy = cytoscape({
			container: document.getElementById("cy"),
			elements: nodes.concat(requisiteEdges),
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
				{
					selector: `node[class="temporarilyAdded"]`,
					style: {
						"background-color": "#000000",
						content: "data(id)",
						shape: "round-rectangle",
						width: "125px",
						backgroundColor: "#EED202",
						"border-width": 2,
						padding: "10px",
					},
				},
				{
					selector: `edge[class="prerequisites"]`,
					style: {
						width: 3,
						"line-color": "#000000",
						"target-arrow-color": "#000000",
						"target-arrow-shape": "triangle",
						"curve-style": "bezier",
					},
				},
				{
					selector: `edge[class="corequisites"]`,
					style: {
						width: 3,
						"line-color": "#000000",
						"target-arrow-color": "#000000",
						"target-arrow-shape": "triangle",
						"curve-style": "bezier",
						"line-style": "dotted",
					},
				},
				{
					selector: `edge[class="prerequisitesOrCorequisites"]`,
					style: {
						width: 3,
						"line-color": "#000000",
						"target-arrow-color": "#000000",
						"target-arrow-shape": "triangle",
						"curve-style": "bezier",
						"line-style": "dashed",
					},
				},
			],
			layout: {
				name: "dagre",
				// @ts-expect-error: dagre import is not typed here
				nodeDimensionsIncludeLabels: true,
			},
		})

		// graph operations
		const setPredecessorSuccessorCounts = () => {
			cy.nodes().forEach((ele) => {
				const predecessorCount = ele.predecessors().nodes().length
				const successorCount = ele.successors().nodes().length
				ele.style({
					label: `${ele.id()} | ${predecessorCount} ${successorCount}`,
					"text-valign": "center",
					"text-halign": "center",
				})
			})
		}

		setPredecessorSuccessorCounts()

		// ranking based on critical path (kind of deepest) and then broad
		// well, deepest is more like the node with the most predecessors
		const rankMostImportantWithNoRequisites = () => {
			return (
				cy
					.nodes()
					.roots()
					// sorted descending
					.sort((a, b) => {
						const { value: aDeepestDepth } = cy
							.nodes()
							.leaves()
							.filter((ele) => {
								return ele.predecessors().nodes().intersection(a).length > 0
							})
							.nodes()
							.max((ele) => {
								return ele.predecessors().nodes().length
							})
						const { value: bDeepestDepth } = cy
							.nodes()
							.leaves()
							.filter((ele) => {
								return ele.predecessors().nodes().intersection(b).length > 0
							})
							.nodes()
							.max((ele) => {
								return ele.predecessors().nodes().length
							})
						if (aDeepestDepth == bDeepestDepth) {
							// if equal, get broadest (unlocks most courses)
							return a.successors().nodes().length - b.successors().nodes().length
						}
						return aDeepestDepth - bDeepestDepth
					})
					.map((ele) => {
						return ele.id()
					})
					.reverse()
			)
		}
		setMostImportantCoursesThatCanBeTaken(rankMostImportantWithNoRequisites())
	}, [degreePlan, user, temporarilyAddedCourses, temporarilySelectedCustomRequisites, canDisplayFlowchart])

	return (
		<>
			<div className="relative h-[75vh] border-4 border-black m-10">
				{canDisplayFlowchart ? (
					<>
						<div id="cy" className="w-full h-full"></div>
						<Disclosure as="div" className="absolute top-0 right-0 bg-white border-black border-2 overflow-y-scroll">
							<DisclosureButton className="flex flex-row gap-2 items-center p-2 hover:cursor-pointer hover:bg-gray-200">
								<MagnifyingGlassIcon className="h-6 w-6" /> Most Important Courses That Can Be Taken
							</DisclosureButton>
							<DisclosurePanel>
								{mostImportantCoursesThatCanBeTaken.map((course, index) => {
									return (
										<p key={course}>
											{index + 1} {course}
										</p>
									)
								})}
							</DisclosurePanel>
						</Disclosure>
					</>
				) : (
					<div className="absolute top-0 border-black border-2 w-full h-full bg-white overflow-y-scroll">
						<p>Requisites</p>
						{Object.keys(coursesRequisitesNeededFinal).map((course) => {
							return (
								<>
									<p className="bg-orange-400">{course}</p>
									<p>Prerequisites</p>
									<ChooseRequisite
										requisites={coursesRequisitesNeededFinal[course].requisites.prerequisites}
										setTemporarilyAddedCourses={setTemporarilyAddedCourses}
										setTemporarilySelectedCustomRequisites={setTemporarilySelectedCustomRequisites}
										pathToRequisite={[course, "requisites", "prerequisites"]}
										parentCanBeFulfilled={false}
									/>
									<hr></hr>
									<p>Corequisites</p>
									<ChooseRequisite
										requisites={coursesRequisitesNeededFinal[course].requisites.corequisites}
										setTemporarilyAddedCourses={setTemporarilyAddedCourses}
										setTemporarilySelectedCustomRequisites={setTemporarilySelectedCustomRequisites}
										pathToRequisite={[course, "requisites", "corequisites"]}
										parentCanBeFulfilled={false}
									/>
									<hr></hr>
									<p>Prerequisites or Corequisites</p>
									<ChooseRequisite
										requisites={coursesRequisitesNeededFinal[course].requisites.prerequisitesOrCorequisites}
										setTemporarilyAddedCourses={setTemporarilyAddedCourses}
										setTemporarilySelectedCustomRequisites={setTemporarilySelectedCustomRequisites}
										pathToRequisite={[course, "requisites", "prerequisitesOrCorequisites"]}
										parentCanBeFulfilled={false}
									/>
								</>
							)
						})}
					</div>
				)}
			</div>
		</>
	)
}

export default FlowchartCytoscape
