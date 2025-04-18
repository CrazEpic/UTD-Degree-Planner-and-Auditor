import { Button } from "@headlessui/react"
import { TrashIcon } from "@heroicons/react/24/outline"
import axios from "axios"

const DeleteBlockButton = ({ blockID, fetchDegree }) => {
	return (
		<Button
			className="border-2 rounded-md hover:bg-red-200"
			onClick={async () => {
				try {
					await axios.delete("http://localhost:3000/api/buildDegree/deleteBlock", {
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
			<TrashIcon className="w-6 h-6"></TrashIcon>
		</Button>
	)
}

export default DeleteBlockButton
