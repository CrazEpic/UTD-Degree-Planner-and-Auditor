import { Input } from "@headlessui/react"
import axios from "axios"
import { Mode } from "../../types/degree"

const TextBlockView = ({ 
	textBlockID, 
	text, 
	mode,
	type,
	update
}: {
	textBlockID: string
	text: string
	mode: Mode
	type: string
	update: Function
}) => {

	const updateValue = (value: string) => {
		if (type === "DEGREE") {
			try {
				axios.put("/api/buildDegree/updateTextBlock", {
					blockID: textBlockID,
					text: value as string,
				})
				update()
			} catch (error) {
				console.log(error)
			}
		}
		if (type === "COURSE") {
			// API Call to update course information
			// render new information with update()

			/* 
				Return course as JSON with all requisites
			*/
		}
	}

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
						updateValue(newText)
					}}
				>
					<label>
						<Input name="text" placeholder="Enter new text" type="text" defaultValue={text} className={"border-2 border-black rounded-md px-1"} />
					</label>
				</form>
			) : (
				<p>{text}</p>
			)}
		</>
	)
}

export default TextBlockView
