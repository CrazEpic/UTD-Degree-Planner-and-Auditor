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
				<Disclosure as="div" className="border border-black rounded-md p-2" defaultOpen={true}>
					<span className="flex flex-row items-center justify-between">
						<div className="flex flex-row gap-1 items-center">
							<DisclosureButton className="group">
								<ChevronDownIcon className="size-8"></ChevronDownIcon>
							</DisclosureButton>
							{requisites.logicalOperator === "AND" ? <p>AND</p> : <p>OR</p>}
						</div>

						{!parentCanBeFulfilled &&
							(tryToFulfillBranchViaCanBeFulfilled(requisites) ? (
								<CheckCircleIcon className="size-6" />
							) : (
								<ExclamationCircleIcon className="size-6 fill-yellow-400"></ExclamationCircleIcon>
							))}
					</span>
					<DisclosurePanel className="flex flex-col gap-y-2 mt-2">
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
					return requisites.courseID
				case "matcher":
					// TODO: implement matcher requisites
					return requisites.matchList
				case "major":
					return requisites.major
				case "minor":
					return requisites.minor
				case "custom":
					return requisites.text
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
							"/api/course/course?" + `prefix=${requisites.courseID.split(" ")[0]}&number=${requisites.courseID.split(" ")[1]}`
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
				<span className="flex flex-row items-center border border-black rounded-md p-1 justify-between">
					<p className="text-[#037b3f] pl-1">{renderSwitch()}</p>
					<Checkbox
						disabled={!requisites.togglable}
						checked={requisites.canBeFulfilled}
						onChange={(value) => updateTemporarilyRequisiteSelections(value)}
						className="border-black border-2 rounded-md block size-8 bg-white hover:cursor-pointer data-[checked]:bg-blue-500 data-[disabled]:bg-gray-600"
					>
						{({ checked }) => {
							return checked && <CheckIcon className="fill-white w-full h-full m-auto" />
						}}
					</Checkbox>
				</span>
			</>
		)
	} else {
		return <></>
	}
}

export default ChooseRequisite
