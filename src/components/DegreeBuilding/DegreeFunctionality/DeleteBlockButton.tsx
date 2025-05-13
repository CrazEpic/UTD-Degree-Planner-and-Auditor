import { Button } from "@headlessui/react"
import { TrashIcon } from "@heroicons/react/24/outline"
import axios from "axios"

const DeleteBlockButton = ({ 
	blockID,
	fetchDegree,
}: {
	blockID: string,
	fetchDegree: Function,
}) => {
	return (
		<Button
			className="border-2 rounded-md hover:bg-red-200"
			onClick={async () => {
				try {
					await axios.delete("/api/buildDegree/deleteBlock", {
						data: {
							blockID: blockID,
						},
					})
					fetchDegree()
				} catch (error) {
					console.log(error)
				}
			}}
		>
			<TrashIcon className="size-8"></TrashIcon>
		</Button>
	)
}

export default DeleteBlockButton
