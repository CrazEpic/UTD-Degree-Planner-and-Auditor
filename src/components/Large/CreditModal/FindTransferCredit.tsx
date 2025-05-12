import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from "@headlessui/react"
import { Transfer } from "../../../types/degreeTest"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { ChevronRightIcon } from "@heroicons/react/24/outline"
import axios from "axios"

type transferSchool = {
	schoolID: string
	schoolName: string
	schoolCity: string
	schoolStart: string
	schoolCountry: string
}

const fetchSchools = async () => {
	try {
		const response = await axios.get("/api/testAndTransferCredits/transferCreditSchools")
		return response.data
	} catch (error) {
		console.log("Failed to fetch schools: ", error)
		return []
	}
}

const compareSchools = (schoolA: string, schoolB: string, input: string) => {
	const aIndex = schoolA.toLowerCase().indexOf(input.toLowerCase())
	const bIndex = schoolB.toLowerCase().indexOf(input.toLowerCase())

	if (aIndex === -1) return 1
	if (bIndex === -1) return -1

	return aIndex - bIndex
}

const FindTransferCredit = ({ foundCredit, closeModal }: { foundCredit: Dispatch<SetStateAction<Transfer>>; closeModal(): void }) => {
	const [schools, setSchools] = useState([])
	const [schoolQuery, setSchoolQuery] = useState<string>("")
	const [selectedSchool, setSelectedSchool] = useState({})
	// Courses need to be matched to the school (probably through school id)
	const [courses, setCourses] = useState([])
	const [courseQuery, setCourseQuery] = useState<string>("")
	const [selectedCourse, setSelectedCourse] = useState({})

	useEffect(() => {
		const load = async () => {
			const data = await fetchSchools()
			setSchools(data)
		}

		load()
	}, [])

	return (
		<>
			<div className="flex flex-col items-center w-80 border-2 rounded-lg p-4 gap-4">
				<h1 className="h-8 text-2xl max-w-80 line-clamp-1 justify-self-start">Transfer Credit Selection</h1>
				<hr className="w-full" />
				<div className="flex flex-row gap-2 items-center w-full">
					<p>School: </p>
					<Combobox
						as="div"
						value={selectedSchool}
						onChange={async (value) => {
							setSelectedSchool(value)
							if (value === null || (Object.keys(value).length === 0 && value.constructor === Object)) {
								setSchoolQuery("")
								setCourses([])
                                return
							}
							setSchoolQuery(value.schoolName)
							const schoolTransferCourses = await axios.get(
								"/api/testAndTransferCredits/transferCreditEquivalenciesByTransferSchool",
								{
									params: {
										transferSchoolSchoolID: value.schoolID,
									},
								}
							)
							setCourses(schoolTransferCourses.data)
						}}
						className="relative"
					>
						<ComboboxInput
							type="text"
							name="school"
							onChange={(e) => setSchoolQuery(e.target.value)}
							displayValue={() => schoolQuery}
							placeholder="Search for a school"
							className="border-black border rounded-md px-1"
						/>
						<ComboboxOptions className="absolute bg-white border-2 border-black max-h-60 overflow-y-auto z-20">
							{schools
								.filter((school) => {
									if (schoolQuery === "" || schoolQuery === null) {
										return true
									}
									return school.schoolName.toLowerCase().includes(schoolQuery.toLowerCase())
								})
								.sort((schoolA, schoolB) => {
									return compareSchools(schoolA.schoolName, schoolB.schoolName, schoolQuery)
								})
								.slice(0, 50)
								.map((school) => (
									<ComboboxOption value={school} className="hover:bg-gray-200 w-full cursor-pointer px-1 rounded-md">
										{school.schoolName}
									</ComboboxOption>
								))}
						</ComboboxOptions>
					</Combobox>
				</div>
				<div className="flex flex-row gap-2 items-center w-full">
					<p>Course: </p>
					<Combobox
						as="div"
						value={selectedCourse}
						onChange={(value) => {
                            setSelectedCourse(value)
							if (value === null || (Object.keys(value).length === 0 && value.constructor === Object)) {
								setCourseQuery("")
                                return
							}
                        }}
						disabled={Object.keys(selectedSchool).length === 0 && selectedSchool.constructor === Object}
					>
						<ComboboxInput
							type="text"
							name="course"
							onChange={(e) => {
								setCourseQuery(e.target.value)
							}}
							placeholder="Search for a course"
							className="border-black border rounded-md px-1"
						/>
						<ComboboxOptions className="relative mt-1">
							<div className="absolute flex flex-col bg-white w-full max-h-60 overflow-y-auto border-2 rounded-md empty:invisible">
								{courses
									.filter((course) => {
										if (courseQuery === "" || courseQuery === null) {
											return true
										}
										return (
											course.transferCourseID.toLowerCase().includes(courseQuery.toLowerCase()) ||
											course.transferCourseName.toLowerCase().includes(courseQuery.toLowerCase())
										)
									})
                                    .slice(0, 50)
									.map((course) => (
										<ComboboxOption value={course} className="hover:bg-gray-200 w-full cursor-pointer px-1 rounded-md">
											{course.transferCourseID + " " + course.transferCourseName}
										</ComboboxOption>
									))}
							</div>
						</ComboboxOptions>
					</Combobox>
				</div>
				{/* Restyle the buttons */}
				{/* <div className="flex flex-row justify-between w-full">
					<button
						className="flex flex-row w-fit border bg-red-100 p-1 rounded-lg"
						onClick={() => {
							console.log("Cancel Credit")
							closeModal()
						}}
					>
						Cancel
					</button>

					Gray out until the credit is defined
					<button
						className={"flex flex-row justify-end w-fit border p-1 rounded-lg " + (isCompleted() && "bg-green-100")}
						onClick={() => {
							foundCredit(credit)
						}}
						disabled={!isCompleted()}
					>
						Next
						<ChevronRightIcon className="size-6 max-lg:size-8"></ChevronRightIcon>
					</button>
				</div> */}
			</div>
		</>
	)
}

export default FindTransferCredit
