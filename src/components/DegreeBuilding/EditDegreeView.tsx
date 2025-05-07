import { useEffect, useState, useCallback } from "react"
import { CourseBlock, Degree, FlagToggleBlock, MatcherGroupBlock, NonTerminalBlock, TextBlock } from "../../types/degreeTest"
import BlockView from "../BlockViews/BlockView"
import axios from "axios"
import InsertCourse from "./DegreeFunctionality/InsertCourse"
import InsertNonterminalButton from "./DegreeFunctionality/InsertNonterminalButton"
import InsertTextButton from "./DegreeFunctionality/InsertTextButton"
import SelectNonterminalConditions from "./DegreeFunctionality/SelectNonterminalConditions"
import { Button, Disclosure, DisclosureButton, DisclosurePanel, Transition } from "@headlessui/react"
import { ChevronRightIcon, TrashIcon } from "@heroicons/react/24/outline"
import CourseBlockView from "../BlockViews/CourseBlockView"
import MatcherBlockView from "../BlockViews/MatcherBlockView"
import TextBlockView from "../BlockViews/TextBlockView"
import NonterminalConditions from "../Small/NonterminalConditions"
import { parseDegree } from "../../utils/degreeParsing"

// TODO: Add footnotes
const EditDegreeView = ({ degreeName, degreeYear}: { degreeName: string; degreeYear: string; }) => {
	const [degree, setDegree] = useState<Degree | null>(null)

	const fetchDegree = useCallback(async () => {
		try {
			const response = await axios.get(`http://localhost:3000/api/degree/${degreeName}/${degreeYear}`)
			setDegree(parseDegree(response.data))
		} catch (error) {
			console.log(error)
		}
	}, [degreeName, degreeYear])

	const [inTransition, setInTransition] = useState(false)
	const [isOpen, setIsOpen] = useState(false)

	useEffect(() => {
		const timeout = setTimeout(() => {
		  setInTransition(false)
		}, 300)
	
		return () => clearTimeout(timeout)
	  }, [isOpen])

	useEffect(() => {
		fetchDegree()
	}, [degreeName, degreeYear, fetchDegree])

	return (
		<>
			<div className="flex flex-col gap-2">
				<h1 className="text-2xl text-center">{`${degree?.degreeName} ${degree?.degreeYear}`}</h1>
				{degree && (
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
											<div>
												<DisclosurePanel
													className="flex lg:flex-row max-lg:flex-col gap-2 lg:items-center max-lg:w-60"
												>
													<InsertNonterminalButton
														blockID={degree?.RootBlock.blockID}
														insertPosition={
															degree?.RootBlock.innerBlocks.length != 0
																? degree?.RootBlock.innerBlocks[degree?.RootBlock.innerBlocks.length - 1].blockPosition + 1
																: 0
														}
														fetchDegree={fetchDegree}
													/>
													<InsertCourse
														blockID={degree?.RootBlock.blockID}
														insertPosition={
															degree?.RootBlock.innerBlocks.length != 0
																? degree?.RootBlock.innerBlocks[degree?.RootBlock.innerBlocks.length - 1].blockPosition + 1
																: 0
														}
														fetchDegree={fetchDegree}
														transitioning={inTransition}
													/>
													<InsertTextButton
														blockID={degree?.RootBlock.blockID}
														insertPosition={
															degree?.RootBlock.innerBlocks.length != 0
																? degree?.RootBlock.innerBlocks[degree?.RootBlock.innerBlocks.length - 1].blockPosition + 1
																: 0
														}
														fetchDegree={fetchDegree}
													/>
													<SelectNonterminalConditions
														nonterminalBlockID={degree?.RootBlock.blockContent.id}
														conditions={(degree?.RootBlock.blockContent as NonTerminalBlock).conditions}
														fetchDegree={fetchDegree}
													/>
												</DisclosurePanel>
											</div>
											
										</Transition>
									</div>

								</>
							)}
						</Disclosure>	
					</div>
				)}
				{degree?.RootBlock.blockType === "NonTerminal" && (
					<NonterminalConditions
						nonterminalBlockID={degree?.RootBlock.blockContent.id}
						conditions={(degree?.RootBlock.blockContent as NonTerminalBlock).conditions}
						mode={"EDIT"}
						fetchDegree={fetchDegree}
					/>
				)}
				{/* Recursive Blocks */}
				{degree?.RootBlock.innerBlocks.map((inner) => {
					switch (inner.blockType) {
						case "NonTerminal":
							return <BlockView requirement={inner} depth={1} checkbox={false} fetchDegree={fetchDegree} mode={"EDIT"}></BlockView>
						case "Course":
							return (
								<div className="flex flex-row w-full">
									<CourseBlockView course={inner.blockContent as CourseBlock} indent={true} mode={"EDIT"}></CourseBlockView>
									{/* FIX THIS LATER PLEASE */}
                                    <Button
                                        className="border-2 rounded-md hover:bg-red-200 size-fit"
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
								</div>
							)
						case "Text":
							return (
								<div className="flex flex-row w-full">
									<TextBlockView
										textBlockID={inner.blockContent.id}
										text={(inner.blockContent as TextBlock).text}
										mode={"EDIT"}
										fetchDegree={fetchDegree}
									/>
									{/* FIX THIS LATER PLEASE */}
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
                                        <TrashIcon className="size-8"></TrashIcon>
                                    </Button>
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


				{/* Add a disclosure tag just for the footnotes to hide them when unwanted 

				{footnotes.map((footnote) => (
					<p>{footnote}</p>
				))}

				*/}
			</div>
		</>
	)
}

export default EditDegreeView
