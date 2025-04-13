import { EllipsisVerticalIcon, ChevronLeftIcon } from "@heroicons/react/24/solid"
import { Button, Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import axios from "axios"
import { UserContext } from "../../../contexts/UserContext"
import { LinkContext } from "../../../contexts/LinkContext"
import { useContext, useState } from "react"
import { DegreePlanCourse } from "../../../types/degreeTest"

function click(message: string) {
	console.log(message)
}

function PlannerCourse({course}: {course: DegreePlanCourse}) {

	// Might have an issue with the ? "could be undefined"
	const [drop, setDrop] = useState(false)
	const fetchUser = useContext(UserContext)?.fetchUser
	const linkCourse = useContext(LinkContext)?.linkCourse

	return (
		<>
			<div className="border-3 rounded-lg w-full h-[125px] p-1 flex flex-col">
				<div className="flex flex-row justify-between p-1">

					{/* 
						How should we represent the tags on courses
						AP/IB/CLEP Credits or Transferables Courses
						Could also use this to represent Core Courses
						Might just be if (TestCredit) and if (TransferCredit)
					*/}
					<p className="">{"Tag"}</p>
					<div className="relative">

						{/* Will not hover on mobile*/}
						<Menu as="div" className="w-fit">
							<MenuButton>
								<EllipsisVerticalIcon className="size-6 hover:bg-blue-200"></EllipsisVerticalIcon>
							</MenuButton>
							<MenuItems className="absolute right-0 border-2 rounded-lg bg-white flex flex-col z-10">
								<MenuItem 
									as="div" 
									className="flex flex-row items-center text-xl py-3 text-nowrap relative rounded-lg rounded-b-none hover:bg-gray-100" 
									onMouseOver={() => setDrop(true)} 
									onMouseLeave={() => setDrop(false)}
								>
									<ChevronLeftIcon className="size-6 justify-self-start"></ChevronLeftIcon>
									<p>Move Course</p>

									{/* Currently hovers off of the page*/}
									{drop &&
										<div className="absolute ml-[-160px] top-0 left-0 bg-white border-2 rounded-lg flex flex-col w-40 z-20">
											<Button className="rounded-lg rounded-b-none hover:bg-gray-100" onClick={() => click("Spring 25")}>
												<p className="text-xl px-2 py-3 text-nowrap">Spring 2025</p>
											</Button>
											<hr />
											<Button className="hover:bg-gray-100" onClick={() => click("Summer 25")}>
												<p className="text-xl py-3 text-nowrap">Summer 2025</p>	
											</Button>
											<hr />
											<Button className="rounded-lg rounded-t-none hover:bg-gray-100" onClick={() => click("Fall 25")}>
												<p className="text-xl py-3 text-nowrap">Fall 2025</p>
											</Button>
										</div>
									}
								</MenuItem>
								<hr />
								<MenuItem 
									as="button" 
									className="text-xl px-2 py-3 text-nowrap relative hover:bg-gray-100" 
									onClick={() => {
										click("Link")
										if (linkCourse) {
											linkCourse(course.Course)
										}
									}}
								>
									Link Course
								</MenuItem>
								<hr />
								<MenuItem
									as="button"
									className="text-xl px-2 py-3 text-nowrap relative rounded-lg rounded-t-none hover:bg-gray-100"
									onClick={async () => {
										try {
											const response = await axios.delete("http://localhost:3000/api/degreePlan/removeCourse", {
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
			</div>
		</>
	)
}

// Learn to create a default version
// Course Name CR 1234

export default PlannerCourse
