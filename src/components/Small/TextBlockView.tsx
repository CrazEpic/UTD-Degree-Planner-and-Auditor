import { Input } from "@headlessui/react"
import axios from "axios"

const TextBlockView = ({ textBlockID, text, editMode, fetchDegree }) => {
	return (
		<>
			{editMode ? (
				<form
					method="post"
					onSubmit={async (event) => {
						event.preventDefault()
						const form = event.target as HTMLFormElement
						const formData = new FormData(form)
						const newText = formData.get("text") as string
						try {
							axios.put("http://localhost:3000/api/buildDegree/updateTextBlock", {
								blockID: textBlockID,
								text: newText,
							})
							fetchDegree()
						} catch (error) {
							console.log(error)
						}
					}}
				>
					<label>
						<Input name="text" placeholder="Enter new text" type="text" defaultValue={text} className={"border-2 border-black"} onKey />
					</label>
				</form>
			) : (
				<p>{text}</p>
			)}
		</>
	)
}

export default TextBlockView
