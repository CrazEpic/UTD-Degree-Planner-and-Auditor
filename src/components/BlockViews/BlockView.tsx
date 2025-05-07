import { Button, Disclosure, DisclosureButton, DisclosurePanel, Input, Transition } from "@headlessui/react"
import { ChevronDownIcon, ChevronRightIcon, TrashIcon } from "@heroicons/react/24/outline"
import { Block, CourseBlock, FlagToggleBlock, MatcherGroupBlock, NonTerminalBlock, TextBlock } from "../../types/degreeTest"
import ProgressBar from "../Small/Requirements/ProgressBar"
import CourseBlockView from "./CourseBlockView"
import MatcherBlockView from "./MatcherBlockView"
import axios from "axios"
import DeleteBlockButton from "../DegreeBuilding/DegreeFunctionality/DeleteBlockButton"
import InsertNonterminalButton from "../DegreeBuilding/DegreeFunctionality/InsertNonterminalButton"
import InsertTextButton from "../DegreeBuilding/DegreeFunctionality/InsertTextButton"
import InsertCourse from "../DegreeBuilding/DegreeFunctionality/InsertCourse"
import TextBlockView from "./TextBlockView"
import { Mode } from "../../types/requirementWindow"
import SelectNonterminalConditions from "../DegreeBuilding/DegreeFunctionality/SelectNonterminalConditions"
import NonterminalConditions from "../Small/NonterminalConditions"
import { useState, useEffect } from "react"

function BlockView({
	requirement,
	depth,
	checkbox,
	fetchDegree,
	mode,
}: {
	requirement: Block
	depth: number
	checkbox: boolean
	fetchDegree: Function
	mode: Mode
}) {

	// TODO: Implement real progress
	const progress: number[] = [
		1, // getCompleted()
		2, // getPlanned()
		3, // getUnplanned()
	]

	const [inTransition, setInTransition] = useState(false)
	const [isOpen, setIsOpen] = useState(false)

	useEffect(() => {
		const timeout = setTimeout(() => {
		  setInTransition(false)
		}, 300)
	
		return () => clearTimeout(timeout)
	  }, [isOpen])

	return (
		<>
			<div className={"border rounded-lg items-center p-2 pr-0 " + (depth > 1 ? "border-r-0 rounded-r-none " : "")}>
				{mode === "EDIT" && (
					<div className="relative max-lg:w-60">
						<Disclosure as="div" className="flex lg:flex-row max-lg:flex-col max-lg:gap-2">
							{({ open }) => (
								<>
									<div className="relative z-10 lg:pr-2">
										<DisclosureButton 
											className="border-2 border-black rounded-md w-fit h-10 px-1"
											onClick={() => {
												setInTransition(true)
												setIsOpen(prev => !prev)
											}}
										>
											{/* I would want the arrow to move left on smaller screen */}
											<div className="flex flex-row items-center">
												<p className="pl-1">Insert</p>
												<ChevronRightIcon className={"size-8 " + `transition-transform duration-300 ${open ? 'max-lg:rotate-270' : 'max-lg:rotate-90'} ${open ? 'lg:rotate-180' : 'lg:rotate-0'}`}/>
											</div>
										</DisclosureButton>
									</div>

									<div className={"w-fit " + (inTransition && "overflow-hidden")}>
										<Transition
											as="div"
											show={open}
											enter="transition-all duration-300 ease-in-out"
											enterFrom="lg:-translate-x-full max-lg:max-h-0 opacity-0"
											enterTo="lg:translate-x-0 max-lg:max-h-50 opacity-100"
											leave="transition-all duration-300 ease-in-out"
											leaveFrom="lg:translate-x-0 max-lg:max-h-50 opacity-100"
											leaveTo="lg:-translate-x-full max-lg:max-h-0 opacity-0"
										>
											<DisclosurePanel
												className="flex lg:flex-row max-lg:flex-col gap-2 lg:items-center max-lg:w-60"
											>
												<InsertNonterminalButton
													blockID={requirement.blockID}
													insertPosition={
														requirement.innerBlocks.length != 0 ? requirement.innerBlocks[requirement.innerBlocks.length - 1].blockPosition + 1 : 0
													}
													fetchDegree={fetchDegree}
												/>
												<InsertCourse
													blockID={requirement.blockID}
													insertPosition={
														requirement.innerBlocks.length != 0 ? requirement.innerBlocks[requirement.innerBlocks.length - 1].blockPosition + 1 : 0
													}
													fetchDegree={fetchDegree}
													transitioning={inTransition}
												/>
												<InsertTextButton
													blockID={requirement.blockID}
													insertPosition={
														requirement.innerBlocks.length != 0 ? requirement.innerBlocks[requirement.innerBlocks.length - 1].blockPosition + 1 : 0
													}
													fetchDegree={fetchDegree}
												/>
												<SelectNonterminalConditions
													nonterminalBlockID={requirement.blockContent.id}
													conditions={(requirement.blockContent as NonTerminalBlock).conditions}
													fetchDegree={fetchDegree}
												/>
											</DisclosurePanel>
										</Transition>
									</div>
								</>
							)}
						</Disclosure>	
					</div>
				)}
				<Disclosure as="div" defaultOpen={mode === "EDIT"}>
					{({ open }) => (
						<>
							<div className="flex flex-row items-center pr-2">
								<div className="flex flex-row items-center gap-2">
									<DisclosureButton className="group py-2">
										<ChevronDownIcon className={"size-8 " + `transition-transform duration-300 ${open ? 'rotate-180' : 'rotate-0'}`}></ChevronDownIcon>
									</DisclosureButton>

									{/* Text does not truncate or turn to ellipses*/}
									{/* block name */}
									{mode === "EDIT" ? (
										<form
											method="post"
											onSubmit={async (event) => {
												event.preventDefault()
												const form = event.target as HTMLFormElement
												const formData = new FormData(form)
												const blockName = formData.get("blockName") as string
												try {
													axios.put("http://localhost:3000/api/buildDegree/updateBlockName", {
														blockID: requirement.blockID,
														blockName: blockName,
													})
													fetchDegree()
												} catch (error) {
													console.log(error)
												}
											}}
										>
											<label>
												<Input
													name="blockName"
													placeholder="Enter new block name"
													type="text"
													defaultValue={requirement.blockName}
													className={"border-2 border-black h-8 rounded-md w-60 px-1"}
												/>
											</label>
										</form>
									) : (
										<p className="line-clamp-1 justify-self-start">{requirement.blockName}</p>
									)}
								</div>
								<div className="flex flex-row ml-auto items-center justify-self-end mr-2 gap-2">
									{mode === "EDIT" ? (
										<DeleteBlockButton blockID={requirement.blockID} fetchDegree={fetchDegree} />
									) : (
										<>
											<ProgressBar progress={progress}></ProgressBar>
											{checkbox ? (
												<Button>
													{/* TODO: Block Selection */}
												</Button>
											) : (
												// Place holder for block selection
												<div className="size-8"></div>
											)}
										</>
									)}
								</div>
							</div>
							<DisclosurePanel className="flex flex-col gap-3 col-span-6">
								{requirement.blockType === "NonTerminal" && (
									<NonterminalConditions
										nonterminalBlockID={requirement.blockContent.id}
										conditions={(requirement.blockContent as NonTerminalBlock).conditions}
										mode={mode}
										fetchDegree={fetchDegree}
									/>
								)}
								{/* Recursive Blocks */}
								{requirement.innerBlocks.map((inner) => {
									switch (inner.blockType) {
										case "NonTerminal":
											return (
												<BlockView requirement={inner} depth={depth + 1} checkbox={checkbox} fetchDegree={fetchDegree} mode={mode}></BlockView>
											)
										case "Course":
											return (
												<div className="flex flex-row items-center w-full">
													<CourseBlockView course={inner.blockContent as CourseBlock} name={inner.blockName} indent={mode !== "EDIT" ? true : false} mode={mode}></CourseBlockView>
													{/* FIX THIS LATER PLEASE */}
													{mode === "EDIT" && (
														<Button
															className="border-2 rounded-md hover:bg-red-200 m-1 size-fit"
															onClick={async () => {
																try {
																	await axios.delete("http://localhost:3000/api/buildDegree/deleteBlock", {
																		data: {
																			blockID: inner.blockID,
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
													)}
												</div>
											)
										case "Text":
											return (
												<div className="flex flex-row w-full">
													<TextBlockView
														textBlockID={inner.blockContent.id}
														text={(inner.blockContent as TextBlock).text}
														mode={mode}
														fetchDegree={fetchDegree}
													/>
													{/* FIX THIS LATER PLEASE */}
													{mode === "EDIT" && (
														<Button
															className="border-2 rounded-md hover:bg-red-200"
															onClick={async () => {
																try {
																	await axios.delete("http://localhost:3000/api/buildDegree/deleteBlock", {
																		data: {
																			blockID: inner.blockID,
																		},
																	})
																	fetchDegree()
																} catch (error) {
																	console.log(error)
																}
															}}
														>
															<TrashIcon className="min-w-6 min-h-6"></TrashIcon>
														</Button>
													)}
												</div>
											)
										case "MatcherGroup":
											return <MatcherBlockView matcher={inner.blockContent as MatcherGroupBlock}></MatcherBlockView>
										case "FlagToggle":
											return <p>{(inner.blockContent as FlagToggleBlock).flagId}</p>
										default:
											return <p>Unknown Block Type</p>
									}
								})}
							</DisclosurePanel>
						</>
					)}
				</Disclosure>
			</div>
		</>
	)
}

export default BlockView
