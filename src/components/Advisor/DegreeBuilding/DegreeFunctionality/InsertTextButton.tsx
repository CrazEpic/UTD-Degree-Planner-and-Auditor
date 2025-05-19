import axios from "axios"
import { Button } from "@headlessui/react"
import { PlusIcon } from "@heroicons/react/24/outline"

const InsertTextButton = ({ 
	blockID,
	insertPosition,
	fetchDegree,
}: {
	blockID: string,
	insertPosition: number,
	fetchDegree: Function,
}) => {
	return (
		<Button
			className="flex flex-row gap-1 border-2 rounded-md h-10 p-1 items-center hover:bg-green-200 lg:w-min max-lg:w-full"
			onClick={async () => {
				try {
					await axios.post("/api/buildDegree/insertBlockAtPosition", {
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
			<PlusIcon className="size-8"></PlusIcon>
			<p className="text-nowrap pr-1">Text Block</p>
		</Button>
	)
}

export default InsertTextButton
