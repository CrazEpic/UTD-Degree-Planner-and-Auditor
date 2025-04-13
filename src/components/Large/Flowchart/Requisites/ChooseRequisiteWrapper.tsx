import { useState } from "react"
import ChooseRequisite from "./ChooseRequisite"

const ChooseRequisiteWrapper = (requisites) => {
	const [requisite, setRequisite] = useState(requisites.requisites)

	return (
		<>
			<ChooseRequisite requisites={requisite} setRequisites={setRequisite} pathToRequisite={[]} parentFulfilled={false} />
		</>
	)
}

export default ChooseRequisiteWrapper
