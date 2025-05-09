import { Button, Disclosure, DisclosureButton, DisclosurePanel, Input } from "@headlessui/react"
import { ChevronDownIcon, PlusIcon } from "@heroicons/react/24/outline"
import { CourseBlock, Test, Transfer } from "../../types/degreeTest"
import { useState } from "react"

let transferDefault : Transfer[] = [
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

let testCourses : Test[] = [
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

let requisiteList : Requisite[] = [
	{
		name: "Req 1",
	},
	{
		name: "Req 2",
	},
	{
		name: "Req 3",
	},
	{
		name: "Req 4",
	},
]

type Requisite = {
	name: string
}

const renderRequisites = (requisites: Requisite[], name: string) => {
	return (
		<div className="border border-black rounded-md h-fit w-full p-2">
			<Disclosure as="div" className="flex flex-col gap-2">
				<div className="flex flex-row justify-between items-center">
					<DisclosureButton className="flex flex-row gap-2 items-center">
						<ChevronDownIcon className="size-8"></ChevronDownIcon>
						<h1 className="text-md">{name}</h1>
					</DisclosureButton>

					{/* Add Requirement -> Search for course */}
					<Button>
						<PlusIcon className="size-8"></PlusIcon>
					</Button>
				</div>
				<DisclosurePanel className="flex flex-col gap-2">

					{/* Add Grade requirement (somewhere?) / Add Custom (somewhere?) */}
					{requisites.map((req) => (
							<div className="border border-black rounded-md h-fit w-full p-2">
								<p>{req.name}</p>
							</div>
						))
					}
				</DisclosurePanel>
			</Disclosure>
		</div>
	)
}


const BuildCourse = ({ course, update }: { course: CourseBlock, update: Function }) => {

	const [transferCourses, setTransferCourses] = useState<Transfer[]>(transferDefault)

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
									defaultValue={course.Course.name}
									className={"border-2 border-black text-center text-xl h-24 rounded-md w-full"}
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
											<DisclosureButton className="flex flex-row gap-2 items-center">
												<ChevronDownIcon className="size-8"></ChevronDownIcon>
												<h1 className="text-md">Transfer Credits</h1>
											</DisclosureButton>

											{/* Add New -> Search for school + search for course inline */}
											<Button
												onClick={() => {
													setTransferCourses([
														...transferCourses, 
														{
															school: "",
															course: "",
														},
													])
												}}
												>
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
											<DisclosureButton className="flex flex-row gap-2 items-center">
												<ChevronDownIcon className="size-8"></ChevronDownIcon>
												<h1 className="text-md">Test Credits</h1>
											</DisclosureButton>

											{/* Add New, pop up find test credit modal */}
											<Button>
												<PlusIcon className="size-8"></PlusIcon>
											</Button>
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
							<div className="flex flex-col gap-2">
								{renderRequisites(requisiteList, "Prerequisites")}
								{renderRequisites(requisiteList, "Corequisites")}
								{renderRequisites(requisiteList, "Prerequisites or Corequisites")}

								{/* Add Custom (Text field for now?) */}
								<div className="border border-black rounded-md h-fit w-full p-2">
									<Disclosure as="div" className="flex flex-col gap-2">
										<div className="flex flex-row justify-between items-center">
											<DisclosureButton className="flex flex-row gap-2 items-center">
												<ChevronDownIcon className="size-8"></ChevronDownIcon>
												<h1 className="text-md text-left">Custom</h1>
											</DisclosureButton>

											{/* Add new custom requisite */}
											<Button>
												<PlusIcon className="size-8"></PlusIcon>
											</Button>
										</div>
										<DisclosurePanel className="flex flex-col gap-2">
											<p>Text input field should appear here</p>
										</DisclosurePanel>
									</Disclosure>
								</div>
							</div>
						</DisclosurePanel>
					</Disclosure>


				</div>
			</div>
		</>
	)
}

export default BuildCourse
