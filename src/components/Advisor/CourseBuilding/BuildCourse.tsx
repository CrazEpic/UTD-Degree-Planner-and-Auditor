import { useState } from "react"
import { Button, Disclosure, DisclosureButton, DisclosurePanel, Input } from "@headlessui/react"
import { ChevronDownIcon, PlusIcon } from "@heroicons/react/24/outline"
import { CourseRequisite, CustomRequisite, Requisite } from "../../../server/types/requisites"
import { Course } from "../../../types/degree"

const createCourseRequisite = () : CourseRequisite => {
	return {
		type: "course",
		courseID: "CR 1234",
	}
}

const createCustomRequisite = () : CustomRequisite => {
	return {
		type: "custom",
		text: "custom text"
	}
}

// Replace template
let requisiteTemplate : Requisite[] = [
	createCourseRequisite(),
	createCourseRequisite(),
	createCourseRequisite(),
	createCourseRequisite(),
	createCustomRequisite(),
]

const renderRequisites = (requisites: Requisite[], name: string) => {
	return (
		<div className="border border-black rounded-md h-fit w-full p-2">
			<Disclosure as="div" className="flex flex-col gap-2">
				<div className="flex flex-row justify-between items-center">
					<DisclosureButton className="flex flex-row gap-2 items-center">
						<ChevronDownIcon className="size-8"></ChevronDownIcon>
						<h1 className="text-md">{name}</h1>
					</DisclosureButton>
				</div>
				<DisclosurePanel className="flex flex-col gap-2">

					{/* Add Grade requirement (somewhere?) / Add Custom (somewhere?) */}
					{requisites.map((req) => (
							<div className="border border-black rounded-md h-fit w-full p-2">
								{req.type === "course" &&
									<p>{req.courseID}</p>
								}
								{req.type === "custom" &&
									<p>{req.text}</p>
								}
							</div>
						))
					}

					{/* Add Requirement -> Search for course / Add custom */}
					<div className="flex flex-row items-center gap-2">
						<Button 
							className="flex flex-row justify-center items-center border border-black rounded-md w-full hover:bg-green-200"
							onClick={() => {
								
							}}
						>
							Requirement
							<PlusIcon className="size-8"></PlusIcon>
						</Button>
						<Button 
							className="flex flex-row justify-center items-center border border-black rounded-md w-full hover:bg-green-200"
							onClick={() => {

							}}
						>
							Custom
							<PlusIcon className="size-8"></PlusIcon>
						</Button>
					</div>
				</DisclosurePanel>
			</Disclosure>
		</div>
	)
}

const BuildCourse = ({ course, update }: { course: Course, update: Function }) => {

	// TODO: Use these
	const [prerequisites, setPrerequisites] = useState<Requisite[]>(requisiteTemplate)
	const [corequisites, setCorequisites] = useState<Requisite[]>(requisiteTemplate)
	const [prerequisitesOrCorequisites, setPrerequisitesOrCorequisites] = useState<Requisite[]>(requisiteTemplate)

	return (
		<>
			<div className="flex flex-col gap-2 items-center min-w-80 m-auto p-4">

				{/* Course View */}
				<div className="flex flex-col border-2 rounded-lg w-full h-fit p-2">
					{/* Tag information for test and transfer credit possibilities
						<div className="flex flex-row justify-between p-1">
							<p className="">{"Tag"}</p>
							<div className="size-8"></div>
						</div> 
					*/}

					<div className="flex flex-col items-center gap-2 min-w-80 px-3">				
						<p className="self-start text-2xl">{course.prefix + " " + course.number}</p>

						{/* Input Name */}
						<form
							method="post"
							onSubmit={async (event) => {
								event.preventDefault()
								const form = event.target as HTMLFormElement
								const formData = new FormData(form)
								const courseName = formData.get("courseName") as string
								update(course.id, "name", courseName)
							}}
							className="w-full"
						>
							<label>
								<Input
									name="courseName"
									placeholder="Name"
									type="text"
									defaultValue={course.name}
									className={"border-2 border-black text-center h-24 rounded-md w-full"}
								/>
							</label>
						</form>
					</div>
				</div>

				{/* Requisites */}
				<div className="flex flex-col gap-2 w-full">
					{renderRequisites(prerequisites, "Prerequisites")}
					{renderRequisites(corequisites, "Corequisites")}
					{renderRequisites(prerequisitesOrCorequisites, "Prerequisites or Corequisites")}
				</div>
			</div>
		</>
	)
}

export default BuildCourse
