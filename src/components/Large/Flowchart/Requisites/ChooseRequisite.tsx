import { ChevronDownIcon, CheckIcon, CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/solid"
import { Disclosure, DisclosureButton, DisclosurePanel, Checkbox } from "@headlessui/react"
import axios from "axios"

const ChooseRequisite = ({ requisites, setTemporarilyAddedCourses, setTemporarilySelectedCustomRequisites, pathToRequisite, parentCanBeFulfilled }) => {
	const tryToFulfillBranchViaCanBeFulfilled = (requisites) => {
		if (Object.hasOwn(requisites, "logicalOperator")) {
			// has branches
			if (requisites.logicalOperator === "AND") {
				return requisites.requisites.every((requisite) => tryToFulfillBranchViaCanBeFulfilled(requisite))
			} else if (requisites.logicalOperator === "OR") {
				return requisites.requisites.some((requisite) => tryToFulfillBranchViaCanBeFulfilled(requisite))
			}
		} else if (Object.hasOwn(requisites, "type")) {
			// reached a leaf requisite, check fulfillment
			return requisites.canBeFulfilled
		} else {
			// empty requisite
			return true
		}
	}
	if (Object.hasOwn(requisites, "logicalOperator")) {
		return (
			<>
				<Disclosure defaultOpen={true}>
					<span className="flex flex-row gap-2">
						<DisclosureButton className="group py-2">
							<ChevronDownIcon className="size-[24px]"></ChevronDownIcon>
						</DisclosureButton>
						{requisites.logicalOperator === "AND" ? <p>AND</p> : <p>OR</p>}

						{!parentCanBeFulfilled &&
							(tryToFulfillBranchViaCanBeFulfilled(requisites) ? (
								<CheckCircleIcon className="w-6 h-6" />
							) : (
								<ExclamationCircleIcon className="w-6 h-6 fill-yellow-400"></ExclamationCircleIcon>
							))}
					</span>
					<DisclosurePanel className="flex flex-col gap-y-4 pl-4">
						{requisites.requisites.map((requisite, index) => {
							return (
								<ChooseRequisite
									requisites={requisite}
									setTemporarilyAddedCourses={setTemporarilyAddedCourses}
									setTemporarilySelectedCustomRequisites={setTemporarilySelectedCustomRequisites}
									pathToRequisite={[...pathToRequisite, "requisites", index]}
									parentCanBeFulfilled={tryToFulfillBranchViaCanBeFulfilled(requisites)}
								/>
							)
						})}
					</DisclosurePanel>
				</Disclosure>
			</>
		)
	} else if (Object.hasOwn(requisites, "type")) {
		// reached a leaf requisite, allow selection
		const renderSwitch = () => {
			switch (requisites.type) {
				case "course":
					return <p>{requisites.courseID}</p>
				case "matcher":
					// TODO: implement matcher requisites
					return <p>{requisites.matchList}</p>
				case "major":
					return <p>{requisites.major}</p>
				case "minor":
					return <p>{requisites.minor}</p>
				case "custom":
					return <p>{requisites.text}</p>
			}
		}

		const compareArrays = (a, b) => a.length === b.length && a.every((element, index) => element === b[index])

		const updateTemporarilyRequisiteSelections = async (value) => {
			if (requisites.type == "course") {
				let courseInfo = {}
				if (value) {
					// need to add course
					try {
						const response = await axios.get(
							"http://localhost:3000/api/course?" + `prefix=${requisites.courseID.split(" ")[0]}&number=${requisites.courseID.split(" ")[1]}`
						)
						courseInfo = {
							prefix: response.data.prefix,
							number: response.data.number,
							requisites: response.data.requisites,
						}
					} catch (error) {
						console.error("Error fetching course:", error)
					}
				} else {
					courseInfo = {
						prefix: requisites.courseID.split(" ")[0],
						number: requisites.courseID.split(" ")[1],
						requisites: requisites.requisites,
					}
				}

				setTemporarilyAddedCourses((prev) => {
					if (value) {
						return [...prev, courseInfo]
					} else {
						return prev.filter((course) => !(course.prefix == courseInfo.prefix && course.number == courseInfo.number))
					}
				})
			} else {
				setTemporarilySelectedCustomRequisites((prev) => {
					if (value) {
						return [...prev, pathToRequisite]
					} else {
						return prev.filter((path) => !compareArrays(path, pathToRequisite))
					}
				})
			}
		}

		return (
			<>
				<span className="flex flex-row gap-2">
					<Checkbox
						disabled={!requisites.togglable}
						checked={requisites.canBeFulfilled}
						onChange={(value) => updateTemporarilyRequisiteSelections(value)}
						className="border-black border-2 block size-8 bg-white hover:cursor-pointer data-[checked]:bg-blue-500 data-[disabled]:bg-gray-600"
					>
						{({ checked }) => {
							return checked && <CheckIcon className="fill-white w-full h-full m-auto" />
						}}
					</Checkbox>
					{renderSwitch()}
				</span>
			</>
		)
	} else {
		return <></>
	}
}

export default ChooseRequisite
