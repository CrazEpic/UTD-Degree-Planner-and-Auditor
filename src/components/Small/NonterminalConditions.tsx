import axios from "axios"
import { DegreeConditions } from "../../server/types/degree"
import { Mode } from "../../types/requirementWindow"
import { Input } from "@headlessui/react"

const NonterminalConditions = ({
	nonterminalBlockID,
	conditions,
	mode,
	fetchDegree,
}: {
	nonterminalBlockID: string
	conditions: DegreeConditions
	mode: Mode
	fetchDegree: Function
}) => {
	return Object.keys(conditions).map((condition) => {
		switch (condition) {
			case "blockFulfillmentCondition":
				return (
					<>
						{mode === "EDIT" ? (
							<form
								method="post"
								onSubmit={async (event) => {
									event.preventDefault()
									const form = event.target as HTMLFormElement
									const formData = new FormData(form)
									const newBlocksToFulfill = formData.get("blocksToFulfill") as string
									try {
										await axios.put("http://localhost:3000/api/buildDegree/updateNonterminalBlockCondition", {
											blockID: nonterminalBlockID,
											conditions: {
												...conditions,
												[condition]: { blocksToFulfill: parseInt(newBlocksToFulfill) },
											},
										})
										fetchDegree()
									} catch (error) {
										console.log(error)
									}
								}}
							>
								<div className="flex flex-row">
									<p>Blocks to Fulfill: </p>
									<label>
										<Input
											name="blocksToFulfill"
											type="number"
											min={1}
											defaultValue={conditions[condition].blocksToFulfill}
											className={"border-2 border-black"}
										/>
									</label>
								</div>
							</form>
						) : (
							<p>{"Blocks to Fulfill: " + conditions[condition].blocksToFulfill}</p>
						)}
					</>
				)
			case "minBlockInclusionCondition":
				return (
					<>
						{mode === "EDIT" ? (
							<form
								method="post"
								onSubmit={async (event) => {
									event.preventDefault()
									const form = event.target as HTMLFormElement
									const formData = new FormData(form)
									const newMinBlocksToInclude = formData.get("minBlocksToInclude") as string
									try {
										await axios.put("http://localhost:3000/api/buildDegree/updateNonterminalBlockCondition", {
											blockID: nonterminalBlockID,
											conditions: {
												...conditions,
												[condition]: { minBlocksToInclude: parseInt(newMinBlocksToInclude) },
											},
										})
										fetchDegree()
									} catch (error) {
										console.log(error)
									}
								}}
							>
								<div className="flex flex-row">
									<p>Minimum Blocks to Include: </p>
									<label>
										<Input
											name="minBlocksToInclude"
											type="number"
											min={1}
											defaultValue={conditions[condition].minBlocksToInclude}
											className={"border-2 border-black"}
										/>
									</label>
								</div>
							</form>
						) : (
							<p>{"Minimum Blocks to Include: " + conditions[condition].minBlocksToInclude}</p>
						)}
					</>
				)
			case "creditHourCondition":
				return (
					<>
						{mode === "EDIT" ? (
							<form
								method="post"
								onSubmit={async (event) => {
									event.preventDefault()
									const form = event.target as HTMLFormElement
									const formData = new FormData(form)
									const newMinCreditHours = formData.get("minCreditHours") as string
									try {
										await axios.put("http://localhost:3000/api/buildDegree/updateNonterminalBlockCondition", {
											blockID: nonterminalBlockID,
											conditions: {
												...conditions,
												[condition]: { minCreditHours: parseInt(newMinCreditHours) },
											},
										})
										fetchDegree()
									} catch (error) {
										console.log(error)
									}
								}}
							>
								<div className="flex flex-row">
									<p>Minimum Credit Hours: </p>
									<label>
										<Input
											name="minCreditHours"
											type="number"
											min={1}
											defaultValue={conditions[condition].minCreditHours}
											className={"border-2 border-black"}
										/>
									</label>
								</div>
							</form>
						) : (
							<p>{"Minimum Credit Hours: " + conditions[condition].minCreditHours}</p>
						)}
					</>
				)
			case "levelCondition":
				return (
					<>
						{mode === "EDIT" ? (
							<form
								method="post"
								onSubmit={async (event) => {
									event.preventDefault()
									const form = event.target as HTMLFormElement
									const formData = new FormData(form)
									const newLevel = formData.get("level") as string
									const newCreditHourRequirement = formData.get("creditHourRequirement") as string
									try {
										await axios.put("http://localhost:3000/api/buildDegree/updateNonterminalBlockCondition", {
											blockID: nonterminalBlockID,
											conditions: {
												...conditions,
												[condition]: { level: newLevel, creditHourRequirement: parseInt(newCreditHourRequirement) },
											},
										})
										fetchDegree()
									} catch (error) {
										console.log(error)
									}
								}}
							>
								<div className="flex flex-row">
									<p>Level: </p>
									<label>
										<Input name="level" type="text" defaultValue={conditions[condition].level} className={"border-2 border-black"} />
									</label>
									<p>Credit Hour Requirement: </p>
									<label>
										<Input
											name="creditHourRequirement"
											type="number"
											min={1}
											defaultValue={conditions[condition].creditHourRequirement}
											className={"border-2 border-black"}
										/>
									</label>
                                    <input type="submit" name="submit" value="Submit"/>
								</div>
							</form>
						) : (
							<p>{"Level: " + conditions[condition].level + ", Credit Hour Requirement: " + conditions[condition].creditHourRequirement}</p>
						)}
					</>
				)
			case "hourBeyondBlockCondition":
				return (
					<>
						{mode === "EDIT" ? (
							<form
								method="post"
								onSubmit={async (event) => {
									event.preventDefault()
									const form = event.target as HTMLFormElement
									const formData = new FormData(form)
									const newBlockKey = formData.get("blockKey") as string
									const newHoursBeyondBlock = formData.get("hoursBeyondBlock") as string
									try {
										await axios.put("http://localhost:3000/api/buildDegree/updateNonterminalBlockCondition", {
											blockID: nonterminalBlockID,
											conditions: {
												...conditions,
												[condition]: { blockKey: newBlockKey, hoursBeyondBlock: parseInt(newHoursBeyondBlock) },
											},
										})
										fetchDegree()
									} catch (error) {
										console.log(error)
									}
								}}
							>
								<div className="flex flex-row">
									<p>Block Key: </p>
									<label>
										<Input name="blockKey" type="text" defaultValue={conditions[condition].blockKey} className={"border-2 border-black"} />
									</label>
									<p>Hours Beyond Block: </p>
									<label>
										<Input
											name="hoursBeyondBlock"
											type="number"
											min={1}
											defaultValue={conditions[condition].hoursBeyondBlock}
											className={"border-2 border-black"}
										/>
									</label>
                                    <input type="submit" name="submit" value="Submit"/>
								</div>
							</form>
						) : (
							<p>{"Block Key: " + conditions[condition].blockKey + ", Hours Beyond Block: " + conditions[condition].hoursBeyondBlock}</p>
						)}
					</>
				)
		}
	})
}

export default NonterminalConditions
