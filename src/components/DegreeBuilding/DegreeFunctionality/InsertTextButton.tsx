import { Button } from "@headlessui/react"
import { PlusIcon } from "@heroicons/react/24/outline"
import axios from "axios"

const InsertTextButton = ({ blockID, insertPosition, fetchDegree }) => {
	return (
		<Button
			className="border-2 rounded-md hover:bg-green-200 w-min flex flex-row"
			onClick={async () => {
				try {
					await axios.post("http://localhost:3000/api/buildDegree/insertBlockAtPosition", {
						parentBlockID: blockID,
						position: insertPosition,
						blockTypeInformation: {
							blockType: "TEXT",
						},
					})
					fetchDegree()
				} catch (error) {
					console.log(error)
				}
			}}
		>
			<PlusIcon className="w-6 h-6"></PlusIcon>
			<p className="text-nowrap">Insert Text Block</p>
		</Button>
	)
}

export default InsertTextButton
