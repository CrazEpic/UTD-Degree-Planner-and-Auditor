import { ChevronDownIcon, CheckIcon, CheckCircleIcon } from "@heroicons/react/24/solid"
import { Disclosure, DisclosureButton, DisclosurePanel, Checkbox } from "@headlessui/react"
import { useState } from "react"

const ChooseRequisite = (requisites) => {
	console.log(requisites)
	if (Object.hasOwn(requisites.requisites, "logicalOperator")) {
		// has branches, only display child requisites and if fulfilled
		// if (requisites.logicalOperator === "AND") {
		// 	return requisites.requisites.every((requisite) => tryToFulfillBranch(requisite))
		// } else if (requisites.logicalOperator === "OR") {
		// 	return requisites.requisites.some((requisite) => tryToFulfillBranch(requisite))
		// }
		console.log("in here 1")
		return (
			<>
				<Disclosure defaultOpen={true}>
					<span className="flex flex-row gap-2">
						<DisclosureButton className="group py-2">
							<ChevronDownIcon className="size-[24px]"></ChevronDownIcon>
						</DisclosureButton>
                        {requisites.requisites.logicalOperator === "AND" ? (
                            <p>AND</p>
                        ) : (
                            <p>OR</p>
                        )}
					</span>
					<DisclosurePanel className="flex flex-col gap-y-4 pl-4">
						{requisites.requisites.requisites.map((requisite) => {
							return <ChooseRequisite requisites={requisite} />
						})}
					</DisclosurePanel>
				</Disclosure>
			</>
		)
	} else if (Object.hasOwn(requisites.requisites, "type")) {
		// reached a leaf requisite, allow selection
		console.log("in here 2")
		const renderSwitch = () => {
			switch (requisites.requisites.type) {
				case "course":
					return <p>{requisites.requisites.courseID}</p>
				case "matcher":
					// TODO: implement matcher requisites
					return <p>{requisites.requisites.matchList}</p>
				case "major":
					return <p>{requisites.requisites.major}</p>
				case "minor":
					return <p>{requisites.requisites.minor}</p>
				case "custom":
					return <p>{requisites.requisites.text}</p>
			}
		}

		return (
			<>
				<span className="flex flex-row gap-2">
					<Checkbox className="border-black border-2 block size-8 bg-white hover:cursor-pointer data-[checked]:bg-blue-500">
						{({ checked }) => {
							return checked && <CheckIcon className="fill-white w-full h-full m-auto" />
						}}
					</Checkbox>
					{renderSwitch()}
				</span>
			</>
		)
	} else {
		console.log("in here 3")
		return <></>
	}
}

export default ChooseRequisite
