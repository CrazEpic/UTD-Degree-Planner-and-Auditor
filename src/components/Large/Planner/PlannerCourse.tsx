import { EllipsisVerticalIcon, ChevronRightIcon } from "@heroicons/react/24/solid"
import { Button, Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import axios from "axios"
import { UserContext } from "../../../contexts/UserContext"
import { useContext, useState } from "react"
import { DegreePlanCourse, SemesterTerm } from "../../../types/degree"
import { getAllSemestersFromStartToEnd } from "../../../utils/semester"
import { ModalContext } from "../../../contexts/ModalContext"
import { getTagInformation } from "../../../utils/course"


function PlannerCourse({ course }: { course: DegreePlanCourse }) {
	// Might have an issue with the ? "could be undefined"
	const [drop, setDrop] = useState(false)
	const fetchUser = useContext(UserContext)?.fetchUser
	const user = useContext(UserContext)?.user

	const linkCourse = useContext(ModalContext)?.linkCourse

	const allSemestersFromStartToEnd = getAllSemestersFromStartToEnd(
		{ term: user?.DegreePlan?.startSemesterTerm as SemesterTerm, year: parseInt(user?.DegreePlan?.startSemesterYear as string) },
		{ term: user?.DegreePlan?.endSemesterTerm  as SemesterTerm, year: parseInt(user?.DegreePlan?.endSemesterYear as string) }
	)

	const tags = getTagInformation(course)

	return (
		<>
			<div className="border-3 rounded-lg w-full h-[140px] p-1 flex flex-col">
				<div className="flex flex-row justify-between p-1">
					{/* 
						How should we represent the tags on courses
						AP/IB/CLEP Credits or Transferables Courses
						Could also use this to represent Core Courses
						Might just be if (TestCredit) and if (TransferCredit)
					*/}
					<p className="">{tags.join(',')}</p>
					<div className="relative">
						{/* Will not hover on mobile*/}
						<Menu as="div" className="w-fit">
							<MenuButton>
								<EllipsisVerticalIcon className="size-8 hover:bg-blue-200"></EllipsisVerticalIcon>
							</MenuButton>
							<MenuItems className="absolute right-0 border-2 rounded-lg bg-white flex flex-col z-10">

								{/* Move Course */}
								<MenuItem
									as="div"
									className="flex flex-row items-center justify-between text-xl py-3 p-1 text-nowrap relative rounded-lg rounded-b-none hover:bg-gray-100"
									onMouseOver={() => setDrop(true)}
									onMouseLeave={() => setDrop(false)}
								>
									{/* TODO: Do not allow dropdown to be clipped */}
									<p>Move Course</p>
									<ChevronRightIcon className="size-6"></ChevronRightIcon>
									{drop && (
										<div className="absolute mr-[-160px] top-0 right-0 bg-white border-2 rounded-lg flex flex-col w-40 z-20">
											{allSemestersFromStartToEnd.map((semester) => (
												<>
													<Button
														className="rounded-lg rounded-b-none hover:bg-gray-100"
														onClick={async () => {
															try {
																const response = await axios.put("/api/degreePlan/updateCourseSemester", {
																	degreePlanCourseID: course.degreePlanCourseID,
																	semester: {
																		semesterTerm: semester.split(" ")[0],
																		semesterYear: semester.split(" ")[1],
																	},
																})

																// If fetchUser is undefined this will be a problem
																if (fetchUser) {
																	fetchUser()
																}
															} catch (error) {
																console.error("Error removing course: ", error)
															}
														}}
													>
														<p className="text-xl px-2 py-3 text-nowrap">{`${semester.split(" ")[0]} ${semester.split(" ")[1]}`}</p>
													</Button>
													<hr />
												</>
											))}
											<Button
												className="rounded-lg rounded-b-none hover:bg-gray-100"
												onClick={async () => {
													try {
														const response = await axios.put("/api/degreePlan/updateCourseSemester", {
															degreePlanCourseID: course.degreePlanCourseID,
															semester: null
														})

														// If fetchUser is undefined this will be a problem
														if (fetchUser) {
															fetchUser()
														}
													} catch (error) {
														console.error("Error removing course: ", error)
													}
												}}
											>
												<p className="text-xl px-2 py-3 text-nowrap">{"Future"}</p>
											</Button>
										</div>
									)}
								</MenuItem>
								<hr />

								{/* TODO: Switch to unlink if currently linked */}
								<MenuItem
									as="button"
									className="text-xl px-2 py-3 text-nowrap relative hover:bg-gray-100"
									onClick={() => {
										console.log("Link")
										if (linkCourse) {
											linkCourse(course.Course)
										}
									}}
								>
									Link Course
								</MenuItem>
								<hr />

								{/* Remove Course */}
								<MenuItem
									as="button"
									className="text-xl px-2 py-3 text-nowrap relative rounded-lg rounded-t-none hover:bg-gray-100"
									onClick={async () => {
										try {
											const response = await axios.delete("/api/degreePlan/removeCourse", {
												data: { degreePlanCourseID: course.degreePlanCourseID },
											})

											// If fetchUser is undefined this will be a problem
											if (fetchUser) {
												fetchUser()
											}
										} catch (error) {
											console.error("Error removing course: ", error)
										}
									}}
								>
									Remove Course
								</MenuItem>
							</MenuItems>
						</Menu>
					</div>
				</div>
				<h1 className="text-xl text-center self-center">{course.prefix + " " + course.number}</h1>
				<p className="text-md text-center self-center line-clamp-2 max-w-8/10">{course.Course.name}</p>
				{tags.includes("T") &&
					<p>More words</p>
				}
			</div>
		</>
	)
}

export default PlannerCourse
