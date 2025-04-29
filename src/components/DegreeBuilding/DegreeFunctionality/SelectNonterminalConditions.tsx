import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react"
import { useState } from "react"
import { DegreeConditions } from "../../../server/types/degree"
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/24/outline"
import axios from "axios"

const SelectNonterminalConditions = ({
	nonterminalBlockID,
	conditions,
	fetchDegree,
}: {
	nonterminalBlockID: string
	conditions: DegreeConditions
	fetchDegree: Function
}) => {
	const handleConditionChange = async (value: Array<string>) => {
		// either addedCondition or deletedCondition will be undefined
		const addedCondition = value.filter((v) => !selectedConditions.includes(v))[0]
		const deletedCondition = selectedConditions.filter((v) => !value.includes(v))[0]
		if (addedCondition) {
			let newCondition
			switch (addedCondition) {
				case "blockFulfillmentCondition":
					newCondition = {
						blocksToFulfill: 1,
					}
					break
				case "minBlockInclusionCondition":
					newCondition = {
						minBlocksToInclude: 1,
					}
					break
				case "creditHourCondition":
					newCondition = {
						minCreditHours: 1,
					}
					break
				case "levelCondition":
					newCondition = {
						creditHourRequirement: 1,
						level: "4000",
					}
					break
				case "hourBeyondBlockCondition":
					newCondition = {
						blockKey: "",
						hoursBeyondBlock: 1,
					}
					break
			}
			const newConditions = {
				...conditions,
				[addedCondition]: newCondition,
			}
			try {
				await axios.put("http://localhost:3000/api/buildDegree/updateNonterminalBlockCondition", {
					blockID: nonterminalBlockID,
					conditions: newConditions,
				})
			} catch (error) {
				console.log(error)
			}
		} else {
			const newConditions = {
				...conditions,
			}
			delete newConditions[deletedCondition]
			try {
				await axios.put("http://localhost:3000/api/buildDegree/updateNonterminalBlockCondition", {
					blockID: nonterminalBlockID,
					conditions: newConditions,
				})
			} catch (error) {
				console.log(error)
			}
		}
		await fetchDegree()
		setSelectedConditions(value)
	}

	const possibleConditions = ["blockFulfillmentCondition", "minBlockInclusionCondition", "creditHourCondition", "levelCondition", "hourBeyondBlockCondition"]

	const [selectedConditions, setSelectedConditions] = useState(Object.keys(conditions))

	return (
		<>
			<Listbox value={selectedConditions} onChange={handleConditionChange} multiple>
				<ListboxButton className="flex flex-row gap-1 items-center border-2 rounded-md h-10 p-1 hover:bg-green-200 line-clamp-1">
					<ChevronDownIcon className="size-6 max-lg:size-8"></ChevronDownIcon>
					<p className="text-nowrap pr-1">Select Conditions</p>
				</ListboxButton>
				<ListboxOptions className="border-black border-2 rounded-md mt-1 bg-white" anchor="bottom">
					{possibleConditions.map((condition) => (
						<ListboxOption className="cursor-pointer" key={condition} value={condition}>
							{({ selected }) => (
								<div className="flex items-center gap-2 p-2 hover:bg-green-200">
									<div className="border-2 border-black w-4 h-4">{selected && <CheckIcon />}</div>
									{condition}
								</div>
							)}
						</ListboxOption>
					))}
				</ListboxOptions>
			</Listbox>
		</>
	)
}

export default SelectNonterminalConditions
