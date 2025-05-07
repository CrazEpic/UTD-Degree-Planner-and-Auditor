import { Button, Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from "@headlessui/react"
import { PlusIcon } from "@heroicons/react/24/outline"
import axios from "axios"
import { useContext, useState } from "react"
import { CoursesContext } from "../../../contexts/CoursesContext"
import { Course } from "../../../types/degreeTest"

const getRelevance = (course: Course, query: string) => {
	const prefix = course.prefix.toLowerCase();
	const number = course.number.toLowerCase();
	const name = course.name.toLowerCase();
	
	const fullCode = `${prefix} ${number}`;

	// TODO: Prefix is weighted improperly
	if (fullCode === query || name === query) return 3;
	if (fullCode.startsWith(query) || name.startsWith(query)) return 2;
	if (fullCode.includes(query) || name.includes(query)) return 1;
	return 0;
}

// TODO: Style this properly
const CourseSearch = ({ 
	blockID, 
	insertPosition, 
	fetchDegree, 
	transitioning, 
} : { 
	blockID: string,
	insertPosition: number, 
	fetchDegree: Function, 
	transitioning: boolean, 
}) => {
	const [selectedCourse, setSelectedCourse] = useState({
		prefix: "",
		number: "",
		name: "",
	})
	const [query, setQuery] = useState("")
	const courses = useContext(CoursesContext)?.courses || []

	const selected = selectedCourse.prefix === "" || selectedCourse.number === "" || selectedCourse.name === ""

	return (
		<>
			<div className="flex flex-row gap-1 items-center border-black border-2 rounded-md h-10 p-1 lg:w-min max-lg:w-full">
				<Button
					onClick={async () => {
						if (selected) {
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

							// Resets the value of the combobox
							setSelectedCourse({
								prefix: "",
								number: "",
								name: "",
							})
						} catch (error) {
							console.log(error)
						}
					}}
					disabled={selected}
					className="size-8"
				>
					<PlusIcon className="size-8"></PlusIcon>
				</Button>
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
					disabled={transitioning}
				>
					<div className="relative">
						<ComboboxInput
							displayValue={(course: Course) => {
								if (course.prefix === "" && course.number === "" && course.name === "") {
									return ""
								}
								console.log(course)
								return `${course.prefix} ${course.number} ${course.name}`
							}}
							onChange={(event) => setQuery(event.target.value)}
							placeholder="Search for course"
							className=""
						/>
						<ComboboxOptions className="absolute bg-white border-black border-2 max-h-60 overflow-y-auto z-20">
							{courses
								.filter((course) => {
									if (query === "" || query === null) {
										return true
									}
									return `${course.prefix} ${course.number} ${course.name}`.toLowerCase().includes(query.toLowerCase())
								})
								.sort((courseA, courseB) => {
									const lowerQuery = query.toLowerCase()

									const relevanceA = getRelevance(courseA, lowerQuery)
									const relevanceB = getRelevance(courseB, lowerQuery)

									if (relevanceA !== relevanceB) return relevanceB - relevanceA;

									const prefixComp = courseA.prefix.localeCompare(courseB.prefix)
									if (prefixComp !== 0) return prefixComp

									const numberComp = parseInt(courseA.number) - parseInt(courseB.number)
									if (numberComp !== 0) return numberComp;

									return courseA.name.localeCompare(courseB.name)

									
								})
								.slice(0, 100)
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
			</div>
		</>
	)
}

export default CourseSearch
