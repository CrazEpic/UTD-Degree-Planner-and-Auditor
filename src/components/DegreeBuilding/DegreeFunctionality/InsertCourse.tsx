import { Button, Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from "@headlessui/react"
import { PlusIcon } from "@heroicons/react/24/outline"
import axios from "axios"
import { useEffect, useState } from "react"

const CourseSearch = ({ blockID, insertPosition, fetchDegree }) => {
	const [selectedCourse, setSelectedCourse] = useState({
		prefix: "",
		number: "",
		name: "",
	})
	const [query, setQuery] = useState("")

	const [courses, setCourses] = useState([])
	// TODO: should probably put this in a context or something
	const fetchCourses = async () => {
		try {
			const response = await axios.get("http://localhost:3000/api/courses")
			setCourses(response.data)
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		fetchCourses()
	}, [])

	return (
		<>
			<div className="flex flex-row">
				<Combobox
					value={selectedCourse}
					onChange={(value) => {
						if (value) {
							setSelectedCourse(value)
						}
					}}
					by={(courseA, courseB) => {
						return courseA.prefix === courseB.prefix && courseA.number === courseB.number && courseA.name === courseB.name
					}}
					immediate
				>
					<div className="relative">
						<ComboboxInput
							displayValue={(course) => {
								if (course.prefix === "" && course.number === "" && course.name === "") {
									return ""
								}
								console.log(course)
								return `${course.prefix} ${course.number} ${course.name}`
							}}
							onChange={(event) => setQuery(event.target.value)}
							placeholder="Search for course"
							className="border-2 border-black rounded-md p-2"
						/>
						<ComboboxOptions className="absolute bg-white border-black border-2 max-h-60 overflow-y-auto z-10">
							{courses
								.filter((course) => {
									if (query === "" || query === null) {
										return true
									}
									return `${course.prefix} ${course.number} ${course.name}`.toLowerCase().includes(query.toLowerCase())
								})
								.map((course) => (
									<>
										<ComboboxOption
											key={`${course.prefix} ${course.number} ${course.name}`}
											value={{ prefix: course.prefix, number: course.number, name: course.name }}
											className="data-[focus]:bg-blue-100 cursor-pointer text-nowrap"
										>
											{`${course.prefix} ${course.number} ${course.name}`}
										</ComboboxOption>
										<hr />
									</>
								))}
						</ComboboxOptions>
					</div>
				</Combobox>
				<Button
					onClick={async () => {
						if (selectedCourse.prefix === "" || selectedCourse.number === "" || selectedCourse.name === "") {
							return
						}
						try {
							await axios.post("http://localhost:3000/api/buildDegree/insertBlockAtPosition", {
								parentBlockID: blockID,
								position: insertPosition,
								blockTypeInformation: {
									blockType: "COURSE",
									prefix: selectedCourse.prefix,
									number: selectedCourse.number,
								},
							})
							fetchDegree()
						} catch (error) {
							console.log(error)
						}
					}}
					className="hover:bg-blue-200 ml-auto mr-4 size-6 max-lg:size-8"
				>
					<PlusIcon className="w-6 h-6"></PlusIcon>
				</Button>
			</div>
		</>
	)
}

export default CourseSearch
