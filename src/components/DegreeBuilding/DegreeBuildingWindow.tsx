import { useState, useEffect } from "react"
import RequirementWindow from "../Small/Requirements/RequirementWindow"
import { Combobox, ComboboxOptions, ComboboxOption, ComboboxInput, Input, Switch } from "@headlessui/react"
import axios from "axios"

const DegreeBuildingWindow = () => {
	const [degrees, setDegrees] = useState([])
	const [selectedDegree, setSelectedDegree] = useState({
		degreeName: "",
		degreeYear: -1,
	})
	const [query, setQuery] = useState("")
	const [addDegreeVisible, setAddDegreeVisible] = useState(false)
	const [previewMode, setPreviewMode] = useState(false)
	const fetchDegrees = async () => {
		try {
			const response = await axios.get("http://localhost:3000/api/degree/degrees")
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
			<h1>Degree Building Window</h1>
			<div className="flex flex-row mb-10">
				<Combobox
					value={selectedDegree}
					onChange={(value) => {
						if (value) {
							setSelectedDegree(value)
						}
					}}
					by={(degreeA, degreeB) => {
						return degreeA.degreeName === degreeB.degreeName && degreeA.degreeYear === degreeB.degreeYear
					}}
				>
					<div>
						<ComboboxInput
							onChange={(event) => {
								setQuery(event.target.value)
							}}
							displayValue={(degree) => {
								if (degree.degreeName === "" && degree.degreeYear === -1) {
									return ""
								}
								return degree.degreeName + " " + degree.degreeYear
							}}
							placeholder="Search for a degree"
							className="border-2 border-black rounded-md p-2"
						></ComboboxInput>
						<ComboboxOptions static className="border-black border-2">
							{degrees
								.filter((degree) => {
									return `${degree.degreeName} + " " + ${degree.degreeYear}`.toLowerCase().includes(query.toLowerCase())
								})
								.map((degree) => {
									return (
										<ComboboxOption
											key={degree.degreeName + " " + degree.degreeYear}
											value={degree}
											className="hover:bg-gray-200 cursor-pointer"
										>
											{degree.degreeName + " " + degree.degreeYear}
										</ComboboxOption>
									)
								})}
						</ComboboxOptions>
					</div>
				</Combobox>
				<div>
					<Switch
						checked={addDegreeVisible}
						onChange={setAddDegreeVisible}
						className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition data-[checked]:bg-blue-600"
					>
						<span className="size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6" />
					</Switch>
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
									await axios.post("http://localhost:3000/api/buildDegree/degree", {
										name: name,
										year: year,
									})
									fetchDegrees()
								} catch (error) {
									console.log(error)
								}
								setAddDegreeVisible(false)
							}}
						>
							<label>
								<Input name="name" placeholder="Enter degree name" type="text" className={"border-2 border-black"}></Input>
							</label>
							<label>
								<Input
									name="year"
									placeholder="Enter year"
									type="number"
									min="1961"
									defaultValue={new Date().getFullYear()}
									className={"border-2 border-black"}
								></Input>
							</label>
							<button type="submit">Submit</button>
						</form>
					)}
				</div>
			</div>
			<p>Preview</p>
			<p>{selectedDegree.degreeName}</p>

			<Switch
				checked={previewMode}
				onChange={setPreviewMode}
				className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition data-[checked]:bg-blue-600"
			>
				<span className="size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6" />
			</Switch>
			{selectedDegree.degreeName !== "" && selectedDegree.degreeYear !== -1 ? (
				<RequirementWindow
					degreeName={selectedDegree.degreeName}
					degreeYear={`${selectedDegree.degreeYear}`}
					mode={previewMode ? "VIEW" : "EDIT"}
				></RequirementWindow>
			) : (
				<div className="flex flex-col gap-2 max-lg:mt-4">
					<p>Please select a degree</p>
				</div>
			)}
		</>
	)
}

export default DegreeBuildingWindow
