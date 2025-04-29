import { Button } from "@headlessui/react"
import { PlusIcon } from "@heroicons/react/24/outline"
import axios from "axios"

const InsertNonterminalButton = ({ blockID, insertPosition, fetchDegree }) => {
	return (
		<Button
			className="flex flex-row gap-1 border-2 rounded-md h-10 p-1 items-center hover:bg-green-200 lg:w-min max-lg:w-full"
			onClick={async () => {
				try {
					await axios.post("http://localhost:3000/api/buildDegree/insertBlockAtPosition", {
						parentBlockID: blockID,
						position: insertPosition,
						blockTypeInformation: {
							blockType: "NONTERMINAL",
						},
					})
					fetchDegree()
				} catch (error) {
					console.log(error)
				}
			}}
		>
			<PlusIcon className="size-6 max-lg:size-8"></PlusIcon>
			<p className="text-nowrap pr-1">Insert Nonterminal Block</p>
		</Button>
	)
}

export default InsertNonterminalButton
