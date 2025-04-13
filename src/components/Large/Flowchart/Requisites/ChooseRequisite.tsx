import { ChevronDownIcon, CheckIcon, CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/solid"
import { Disclosure, DisclosureButton, DisclosurePanel, Checkbox } from "@headlessui/react"

const ChooseRequisite = ({ requisites, setRequisites, pathToRequisite, parentFulfilled }) => {
	const tryToFulfillBranchViaSelected = (requisites) => {
		if (Object.hasOwn(requisites, "logicalOperator")) {
			// has branches
			if (requisites.logicalOperator === "AND") {
				return requisites.requisites.every((requisite) => tryToFulfillBranchViaSelected(requisite))
			} else if (requisites.logicalOperator === "OR") {
				return requisites.requisites.some((requisite) => tryToFulfillBranchViaSelected(requisite))
			}
		} else if (Object.hasOwn(requisites, "type")) {
			// reached a leaf requisite, check fulfillment
			return requisites.selected
		} else {
			// empty requisite
			return true
		}
	}
	if (Object.hasOwn(requisites, "logicalOperator")) {
		// has branches, only display child requisites and if fulfilled
		// if (requisites.logicalOperator === "AND") {
		// 	return requisites.requisites.every((requisite) => tryToFulfillBranch(requisite))
		// } else if (requisites.logicalOperator === "OR") {
		// 	return requisites.requisites.some((requisite) => tryToFulfillBranch(requisite))
		// }

		return (
			<>
				<Disclosure defaultOpen={true}>
					<span className="flex flex-row gap-2">
						<DisclosureButton className="group py-2">
							<ChevronDownIcon className="size-[24px]"></ChevronDownIcon>
						</DisclosureButton>
						{requisites.logicalOperator === "AND" ? <p>AND</p> : <p>OR</p>}

						{!parentFulfilled &&
							(tryToFulfillBranchViaSelected(requisites) ? (
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
									setRequisites={setRequisites}
									pathToRequisite={[...pathToRequisite, "requisites", index]}
									parentFulfilled={tryToFulfillBranchViaSelected(requisites)}
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

		const setSelected = (selected) => {
			setRequisites((prev) => {
				const newRequisites = { ...prev }
				let current = newRequisites
				for (let i = 0; i < pathToRequisite.length - 1; i++) {
					current = current[pathToRequisite[i]]
				}
				current[pathToRequisite[pathToRequisite.length - 1]].selected = selected
				return newRequisites
			})
		}

		return (
			<>
				<span className="flex flex-row gap-2">
					<Checkbox
						checked={requisites.selected}
						onChange={(value) => setSelected(value)}
						className="border-black border-2 block size-8 bg-white hover:cursor-pointer data-[checked]:bg-blue-500"
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
