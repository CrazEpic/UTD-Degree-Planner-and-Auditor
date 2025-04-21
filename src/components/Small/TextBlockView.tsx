import { Input } from "@headlessui/react"
import axios from "axios"
import { Mode } from "../../types/requirementWindow"

const TextBlockView = ({ textBlockID, text, mode, fetchDegree }: {
	textBlockID: string
	text: string
	mode: Mode
	fetchDegree: Function
}) => {
	return (
		<>
			{mode === "EDIT" ? (
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
						<Input name="text" placeholder="Enter new text" type="text" defaultValue={text} className={"border-2 border-black"} />
					</label>
				</form>
			) : (
				<p>{text}</p>
			)}
		</>
	)
}

export default TextBlockView
