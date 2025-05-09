import { useEffect, useState, useCallback } from "react"
import { CourseBlock, Degree, FlagToggleBlock, MatcherGroupBlock, NonTerminalBlock, TextBlock } from "../../types/degreeTest"
import BlockView from "../BlockViews/BlockView"
import axios from "axios"
import { Button, Disclosure, DisclosureButton } from "@headlessui/react"
import { ChevronRightIcon, TrashIcon } from "@heroicons/react/24/outline"
import CourseBlockView from "../BlockViews/CourseBlockView"
import MatcherBlockView from "../BlockViews/MatcherBlockView"
import TextBlockView from "../BlockViews/TextBlockView"
import NonterminalConditions from "../Small/NonterminalConditions"
import { parseDegree } from "../../utils/degreeParsing"
import InsertPanel from "./DegreeFunctionality/InsertPanel"

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
											<div className="flex flex-row items-center">
												<ChevronRightIcon className={"lg:hidden size-8 " + `transition-transform duration-300 ${open ? 'max-lg:rotate-270' : 'max-lg:rotate-90'}`}/>
												<p className="pl-1">Insert</p>
												<ChevronRightIcon className={"max-lg:hidden size-8 " + `transition-transform duration-300 ${open ? 'lg:rotate-180' : 'lg:rotate-0'}`}/>
											</div>
										</DisclosureButton>
									</div>
									<InsertPanel show={open} requirement={degree?.RootBlock} transition={inTransition} fetchDegree={fetchDegree}/>
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
								<div className="flex flex-row items-center gap-2 w-full">
									<TextBlockView
										textBlockID={inner.blockContent.id}
										text={(inner.blockContent as TextBlock).text}
										mode={"EDIT"}
										type={"DEGREE"}
										update={fetchDegree}
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
