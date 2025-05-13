import { Button, Disclosure, DisclosureButton, DisclosurePanel, Input } from "@headlessui/react"
import { ChevronDownIcon, ChevronRightIcon, TrashIcon } from "@heroicons/react/24/outline"
import { Block, CourseBlock, FlagToggleBlock, MatcherGroupBlock, NonTerminalBlock, TextBlock } from "../../types/block"
import ProgressBar from "../Small/Requirements/ProgressBar"
import CourseBlockView from "./CourseBlockView"
import MatcherBlockView from "./MatcherBlockView"
import axios from "axios"
import DeleteBlockButton from "../DegreeBuilding/DegreeFunctionality/DeleteBlockButton"
import TextBlockView from "./TextBlockView"
import { Mode } from "../../types/degree"
import NonterminalConditions from "../Small/NonterminalConditions"
import { useState, useEffect } from "react"
import InsertPanel from "../DegreeBuilding/DegreeFunctionality/InsertPanel"

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
											<div className="flex flex-row items-center">
												<ChevronRightIcon className={"lg:hidden size-8 " + `transition-transform duration-300 ${open ? 'max-lg:rotate-270' : 'max-lg:rotate-90'}`}/>
												<p className="pl-1">Insert</p>
												<ChevronRightIcon className={"max-lg:hidden size-8 " + `transition-transform duration-300 ${open ? 'lg:rotate-180' : 'lg:rotate-0'}`}/>
											</div>
										</DisclosureButton>
									</div>
									<InsertPanel show={open} requirement={requirement} transition={inTransition} fetchDegree={fetchDegree}/>
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
													axios.put("/api/buildDegree/updateBlockName", {
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
							<DisclosurePanel className="flex flex-col gap-2">
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
													<CourseBlockView course={inner.blockContent as CourseBlock} indent={mode !== "EDIT" ? true : false} mode={mode}></CourseBlockView>
													{/* FIX THIS LATER PLEASE */}
													{mode === "EDIT" && (
														<Button
															className="border-2 rounded-md hover:bg-red-200 m-1 size-fit"
															onClick={async () => {
																try {
																	await axios.delete("/api/buildDegree/deleteBlock", {
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
														type={"DEGREE"}
														update={fetchDegree}
													/>
													{/* FIX THIS LATER PLEASE */}
													{mode === "EDIT" && (
														<Button
															className="border-2 rounded-md hover:bg-red-200"
															onClick={async () => {
																try {
																	await axios.delete("/api/buildDegree/deleteBlock", {
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
