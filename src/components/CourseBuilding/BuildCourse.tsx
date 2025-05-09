import { Button, Disclosure, DisclosureButton, DisclosurePanel, Input } from "@headlessui/react"
import { ChevronDownIcon, PlusIcon } from "@heroicons/react/24/outline"
import { Course } from "../../types/degreeTest"
import { CourseRequisite, CustomRequisite, Requisite } from "../../server/types/requisites"

const createCourseRequisite = () : CourseRequisite => {
	return {
		type: "course",
		courseID: "ID",
	}
}

const createCustomRequisite = () : CustomRequisite => {
	return {
		type: "custom",
		text: "custom text"
	}
}

let requisiteList : Requisite[] = [
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

					{/* Add Requirement -> Search for course / Add custom */}
					<Button>
						<PlusIcon className="size-8"></PlusIcon>
					</Button>
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
				</DisclosurePanel>
			</Disclosure>
		</div>
	)
}

const BuildCourse = ({ course, update }: { course: Course, update: Function }) => {
	return (
		<>
			{/* May center this after the fact */}
			<div className="flex flex-col gap-2 items-center min-w-80 m-auto p-4">

				{/* Course View */}
				<div className="flex flex-col border-2 rounded-lg w-full h-fit p-2">
					{/* Tag information for test and transfer credit possibilities
						<div className="flex flex-row justify-between p-1">
							<p className="">{"Tag"}</p>
							<div className="size-8"></div>
						</div> 
					*/}

					{/* Input Course Values */}
					<div className="flex flex-col items-center gap-2">				
						<div className="flex flex-row gap-2 px-3">
							{/* Input Prefix */}
							<form
								id="prefix-form"
								method="post"
								onSubmit={async (event) => {
									event.preventDefault()
									const form = event.target as HTMLFormElement
									const formData = new FormData(form)
									const coursePrefix = formData.get("coursePrefix") as string
									update(course.id, "prefix", coursePrefix)
								}}
							>
								<label>
									<Input
										name="coursePrefix"
										placeholder="Prefix"
										type="text"
										defaultValue={course.prefix}
										className={"border-2 border-black text-center text-xl h-12 rounded-md w-full"}
									/>
								</label>
							</form>
							{/* Input Number */}
							<form
								method="post"
								onSubmit={async (event) => {
									event.preventDefault()
									const form = event.target as HTMLFormElement
									const formData = new FormData(form)
									const courseNumber = formData.get("courseNumber") as string
									update(course.id, "number", courseNumber)
								}}
							>
								<label>
									<Input
										name="courseNumber"
										placeholder="Number"
										type="text"
										defaultValue={course.number}
										className={"border-2 border-black text-center text-xl h-12 rounded-md w-full"}
									/>
								</label>
							</form>
						</div>
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
							className="w-full px-3"
						>
							<label>
								<Input
									name="courseName"
									placeholder="Name"
									type="text"
									defaultValue={course.name}
									className={"border-2 border-black text-center text-xl h-24 rounded-md w-full"}
								/>
							</label>
						</form>
					</div>
				</div>

				{/* Requisites (probably some object keys idea) */}
				<div className="flex flex-col gap-2 w-full">
					{renderRequisites(requisiteList, "Prerequisites")}
					{renderRequisites(requisiteList, "Corequisites")}
					{renderRequisites(requisiteList, "Prerequisites or Corequisites")}
				</div>
			</div>
		</>
	)
}

export default BuildCourse
