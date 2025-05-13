import { PlusIcon } from "@heroicons/react/24/solid"
import { CourseBlock } from "../../types/block"
import { Button } from "@headlessui/react"
import { UserContext } from "../../contexts/UserContext"
import { useContext } from "react"
import { semesterFromDate, compareSemesters } from "../../utils/semester"
import axios from "axios"

const CourseBlockView = ({ course, indent, mode }: { course: CourseBlock; indent: boolean; mode: string }) => {
	const user = useContext(UserContext)?.user
	const fetchUser = useContext(UserContext)?.fetchUser

	// {
	/* Need a way to toggle this on add / remove
			If present in degree then show planned
			probably a useEffect on mount?
		*/
	// }

	const getCourseStatus = () => {
		if (user?.DegreePlan?.DegreePlanCourses) {
			if (
				!user.DegreePlan.DegreePlanCourses.find((degreePlanCourse) => {
					if (degreePlanCourse.prefix === course.prefix && degreePlanCourse.number === course.number) {
						return true
					}
					return false
				})
			) {
				return "Not Planned"
			}
			if (
				user.DegreePlan.DegreePlanCourses.some((degreePlanCourse) => {
					if (
						degreePlanCourse.semesterTerm &&
						degreePlanCourse.semesterYear &&
						degreePlanCourse.prefix === course.prefix &&
						degreePlanCourse.number === course.number
					) {
						return (
							compareSemesters(
								{
									term: degreePlanCourse.semesterTerm,
									year: parseInt(degreePlanCourse.semesterYear),
								},
								semesterFromDate(new Date())
							) < 0
						)
					}
					// else if (degreePlanCourse.testComponentID) {
					// 	return
					// }
					// else if (degreePlanCourse.transferCourseEquivalencyID) {
					// 	return
					// }
					return false
				})
			) {
				return "Completed"
			} else {
				return "Planned"
			}
		}
		return "Not Planned"
	}

	const courseStatus = getCourseStatus()

	return (
		<div className={"flex flex-row gap-2 border rounded-lg items-center justify-between p-2 pr-0 w-full " + (indent && "border-r-0 rounded-r-none")}>
			<p className="line-clamp-2 max-w-15/20">
				{/* Currently has the assumption of the catalog year as 2024 */}
				<a className="text-[#037b3f]" href={`https://catalog.utdallas.edu/2024/undergraduate/courses/${course.prefix.toLowerCase() + course.number}`}>
					{course.prefix + " " + course.number + " "}
				</a>
				{course.Course.name}
			</p>

			{(mode as string) === "NORMAL" ? (
				<>
					{courseStatus === "Completed" && <p className="underline ml-auto mr-4">Completed</p>}
					{courseStatus === "Planned" && <p className="underline ml-auto mr-4">Planned</p>}
					{courseStatus === "Not Planned" && (
						<Button
							className="hover:bg-blue-200 ml-auto mr-4 size-8"
							onClick={async () => {
								// TODO: Implement planned courses
								try {
									const response = await axios.post("/api/degreePlan/addCourse", {
										degreePlanID: user?.DegreePlan?.degreePlanID,
										course: { prefix: course.prefix, number: course.number },
									})

									// potential undefined fetchUser error
									if (fetchUser) {
										fetchUser()
									}
								} catch (error) {
									console.error("Error adding course: ", error)
								}
							}}
						>
							<PlusIcon></PlusIcon>
						</Button>
					)}
				</>
			) : (
				<div className="lg:size-6 max-lg:size-8"></div>
			)}
		</div>
	)
}

export default CourseBlockView
