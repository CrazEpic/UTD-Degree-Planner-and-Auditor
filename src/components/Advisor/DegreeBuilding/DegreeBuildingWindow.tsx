import { useState, useEffect } from "react"
import axios from "axios"
import { Combobox, ComboboxOptions, ComboboxOption, ComboboxInput, Input, Switch } from "@headlessui/react"
import RequirementWindow from "../../Student/Requirements/RequirementWindow"
import EditDegreeView from "./EditDegreeView"
import { Degree } from "../../../types/degree"

const DegreeBuildingWindow = () => {
	const [degrees, setDegrees] = useState([])
	const [selectedDegree, setSelectedDegree] = useState({
		degreeName: "",
		degreeYear: -1,
	})
	const [query, setQuery] = useState("")
	const [addDegreeVisible, setAddDegreeVisible] = useState(false)
	const [previewMode, setPreviewMode] = useState(false)

	// Undefined Undefined (can be fixed with timeout + placeholder info)
	const fetchDegrees = async () => {
		try {
			const response = await axios.get("/api/degree/degrees")
			setDegrees(response.data)
		} catch (error) {
			console.log(error)
		}
	}
	useEffect(() => {
		fetchDegrees()
	}, [selectedDegree])
	return (
		<>
			<div className="p-4">
				<div className="flex flex-row justify-between">	
					<div className="flex lg:flex-row max-lg:flex-col gap-2 mb-10">

						{/* Search for a degree already in the list */}
						<Combobox
							as="div"
							value={selectedDegree}
							onChange={(value) => {
								if (value) {
									setSelectedDegree(value)
								}
							}}
							by={(degreeA, degreeB) => {
								return degreeA.degreeName === degreeB.degreeName && degreeA.degreeYear === degreeB.degreeYear
							}}
							className="w-50"
						>
							<div>
								<ComboboxInput
									onChange={(event) => {
										setQuery(event.target.value)
									}}
									displayValue={(degree: Degree) => {
										if (degree.degreeName === "" && parseInt(degree.degreeYear) === -1) {
											return ""
										}
										return degree.degreeName + " " + degree.degreeYear
									}}
									placeholder="Search for a degree"
									className="border-2 border-black rounded-md p-2 h-10 mb-1"
								></ComboboxInput>
								<ComboboxOptions static className="border-black border-2 rounded-md">
									{degrees
										.filter((degree: Degree) => {
											return `${degree.degreeName} + " " + ${degree.degreeYear}`.toLowerCase().includes(query.toLowerCase())
										})
										.map((degree: Degree) => {
											return (
												<ComboboxOption
													key={degree.degreeName + " " + degree.degreeYear}
													value={degree}
													className="hover:bg-gray-200 cursor-pointer px-2 rounded-md"
												>
													{degree.degreeName + " " + degree.degreeYear}
												</ComboboxOption>
											)
										})}
								</ComboboxOptions>
							</div>
						</Combobox>

						{/* Add a new degree to the list */}
						<div className="flex lg:flex-row max-lg:flex-col gap-2 h-fit">
							<div className="flex lg:flex-col max-lg:flex-row max-lg:gap-2 items-center">
								<p className="max-lg:hidden">Add New Degree</p>
								<Switch
									checked={addDegreeVisible}
									onChange={setAddDegreeVisible}
									className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition data-[checked]:bg-blue-600"
								>
									<span className="size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6" />
								</Switch>
								<p className="lg:hidden">Add New Degree</p>
							</div>
							{addDegreeVisible && (
								<form
									method="post"
									onSubmit={async (event) => {
										event.preventDefault()
										const form = event.target as HTMLFormElement
										const formData = new FormData(form)
										const name = formData.get("name") as string
										const year = formData.get("year") as string
										try {
											await axios.post("/api/buildDegree/degree", {
												name: name,
												year: year,
											})
											fetchDegrees()
										} catch (error) {
											console.log(error)
										}
										setAddDegreeVisible(false)
									}}
									className="flex lg:flex-row max-lg:flex-col gap-2 items-center"
								>
									<label>
										<Input 
											name="name" 
											placeholder="Enter degree name" 
											type="text" 
											className={"border-2 border-black rounded-md px-2 h-10 w-fit"}></Input>
									</label>
									<label>
										<Input
											name="year"
											placeholder="Enter year"
											type="number"
											min="1961"
											defaultValue={new Date().getFullYear()}
											className={"border-2 border-black rounded-md px-2 h-10 w-fit"}
										></Input>
									</label>
									<button type="submit" name="submit" value="Submit" className="border border-black rounded-md w-full hover:bg-green-200">
										<p>Add Degree</p>
									</button>
								</form>
							)}
						</div>
					</div>

					{/* Toggle for preview mode */}
					<div className="flex flex-col items-center">
						<p>Preview Mode</p>
						{/* When in preview mode, it can still add courses to the planner */}
						<Switch
							checked={previewMode}
							onChange={setPreviewMode}
							className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition data-[checked]:bg-blue-600"
						>
							<span className="size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6" />
						</Switch>
					</div>
				</div>

				


				{selectedDegree.degreeName !== "" && selectedDegree.degreeYear !== -1 ? (
					<div className="border-black border-2 rounded-lg p-4">
						{previewMode ? (
							<RequirementWindow
								degreeName={selectedDegree.degreeName}
								degreeYear={`${selectedDegree.degreeYear}`}
								mode={"VIEW"}
							></RequirementWindow>
						) : (
							<EditDegreeView
								degreeName={selectedDegree.degreeName}
								degreeYear={`${selectedDegree.degreeYear}`}
							></EditDegreeView>
						)}

					</div>
				) : (
					<div className="flex flex-col gap-2 max-lg:mt-4">
						<p>Please select a degree</p>
					</div>
				)}
			</div>
		</>
	)
}

export default DegreeBuildingWindow
