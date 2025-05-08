import { Button, Disclosure, DisclosureButton, DisclosurePanel, Input } from "@headlessui/react"
import { ChevronDownIcon, PlusIcon } from "@heroicons/react/24/outline"
import { CourseBlock, Test, Transfer } from "../../types/degreeTest"

const transferCourses : Transfer[] = [
	{
		school: "Collin College",
		course: "HIST 1301",
	},
	{
		school: "Dallas College",
		course: "HIST 1302",
	},
	{
		school: "Grayson College",
		course: "HIST 1303",
	},
]

const testCourses : Test[] = [
	{
		type: "AP",
		name: "Art: History",
	},
	{
		type: "CLEP",
		name: "Precalculus",
	},
	{
		type: "IB",
		name: "Physics Standard Level",
	},
]

const BuildCourse = ({ course, update }: { course: CourseBlock, update: Function }) => {
	return (
		<>
			{/* May center this after the fact */}
			<div className="flex flex-col gap-2 items-center w-80 m-auto p-4">

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
										className={"border-2 border-black text-center h-8 rounded-md w-full"}
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
										className={"border-2 border-black text-center h-8 rounded-md w-full"}
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
						>
							<label>
								<Input
									name="courseName"
									placeholder="Name"
									type="text"
									defaultValue={course.Course.name}
									className={"border-2 border-black text-center h-8 rounded-md w-60"}
								/>
							</label>
						</form>
					</div>
				</div>

				{/* Test and Transfer Equivalencies? */}
				<div className="border-2 border-black rounded-md p-2 w-full">
					<Disclosure as="div" className="flex flex-col ">
						<DisclosureButton className="flex flex-row gap-2">
							<ChevronDownIcon className="size-8"></ChevronDownIcon>
							<h1 className="text-lg">Test and Transfer Credits</h1>
						</DisclosureButton>
						<DisclosurePanel>
							<div className="flex flex-col gap-2">
								{/* Add Transfer Credit */}
								<div className="border border-black rounded-md h-fit w-full p-2">
									<Disclosure as="div" className="flex flex-col gap-2">
										<div className="flex flex-row justify-between items-center">
											<DisclosureButton className="flex flex-row gap-2">
												<ChevronDownIcon className="size-8"></ChevronDownIcon>
												<h1 className="text-lg">Transfer Credits</h1>
											</DisclosureButton>
											<Button>
												<PlusIcon className="size-8"></PlusIcon>
											</Button>
										</div>
										<DisclosurePanel className="flex flex-col gap-2">
											{transferCourses.map((transfer) => (
													<div className="border border-black rounded-md h-fit w-full p-2">
														<p>{transfer.school + ": " + transfer.course}</p>
													</div>
												))
											}
										</DisclosurePanel>
									</Disclosure>
								</div>

								{/* Add Test Credit */}
								<div className="border border-black rounded-md h-fit w-full p-2">
									<Disclosure as="div" className="flex flex-col gap-2">
										<div className="flex flex-row justify-between items-center">
											<DisclosureButton className="flex flex-row gap-2">
												<ChevronDownIcon className="size-8"></ChevronDownIcon>
												<h1 className="text-lg">Transfer Credits</h1>
											</DisclosureButton>
											<PlusIcon className="size-8"></PlusIcon>
										</div>
										<DisclosurePanel className="flex flex-col gap-2">
											{testCourses.map((test) => (
													<div className="border border-black rounded-md h-fit w-full p-2">
														<p>{test.type + ": " + test.name}</p>
													</div>
												))
											}
										</DisclosurePanel>
									</Disclosure>
								</div>
							</div>
						</DisclosurePanel>
					</Disclosure>
				</div>

				{/* Requisites (probably some object keys idea) */}
				<div className="border-2 border-black rounded-md p-2 w-full">
					<Disclosure as="div" className="flex flex-col ">
						<DisclosureButton className="flex flex-row gap-2">
							<ChevronDownIcon className="size-8"></ChevronDownIcon>
							<h1 className="text-lg">Requisites</h1>
						</DisclosureButton>
						<DisclosurePanel>
							<p>Panel Open</p>

							{/* These should be nearly identical */}

							{/* Prerequisities */}
								{/* Add Requirement */}
									{/* Grade requirement */}
								{/* Add Custom */}


							{/* Corequisities */}
								{/* Add Requirement */}
									{/* Grade requirement */}
								{/* Add Custom */}


							{/* Prerequisities or Corequisities */}
								{/* Add Requirement */}
									{/* Grade requirement */}
								{/* Add Custom */}

							{/* Add Custom (Text field for now?) */}
								{/* Advisor */}
								{/* Major */}
								{/* ALEKS requirement */}
								{/* Standing (Junior?) */}
						</DisclosurePanel>
					</Disclosure>


				</div>
			</div>
		</>
	)
}

export default BuildCourse
