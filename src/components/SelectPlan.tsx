import { Combobox, ComboboxOptions, ComboboxOption, ComboboxInput } from "@headlessui/react"
import { ChevronDoubleRightIcon } from "@heroicons/react/24/outline"
import { useState } from "react"
import { NavLink } from "react-router"


// Modify to allow the user to name their plans?
type Degree = {
    degreeName: string,
    degreeYear: string,
    planned?: boolean
}

const degrees : Degree[] = [
    {
        degreeName: "Computer Science",
        degreeYear: "2025",
        planned: false,
    },
    {
        degreeName: "Computer Science",
        degreeYear: "2024",
        planned: false,
    },
    {
        degreeName: "Computer Science",
        degreeYear: "2023",
        planned: true,
    },
    {
        degreeName: "Computer Engineering",
        degreeYear: "2025",
        planned: false,
    },
    {
        degreeName: "Computer Engineering",
        degreeYear: "2024",
        planned: false,
    },
    {
        degreeName: "Computer Engineering",
        degreeYear: "2023",
        planned: true,
    },
]

const SelectPlan = ({existingUser}: {existingUser: boolean}) => {

    const [selectedDegree, setSelectedDegree] = useState<Degree>({degreeName: "", degreeYear: ""})
    const [query, setQuery] = useState("")

    const [newSelectedDegree, setNewSelectedDegree] = useState<Degree>({degreeName: "", degreeYear: ""})
    const [newQuery, setNewQuery] = useState("")
 
    const loadNewPlan = () => {
        // API Call
    }
    const loadExisitingPlan = () => {

    }

    return (
        <>
            <div className="absolute flex flex-col gap-2 items-center border-2 border-black rounded-lg w-8/10 max-w-100 h-fit inset-0 m-auto p-4 py-8 bg-white">
                {existingUser ? (
                    <> 
                        <p className="text-xl">Select an active plan</p>
                        <div className="flex flex-row gap-2">
                            {/* Select a degree plan (work on wording) */}
                            <Combobox
                                value={selectedDegree}
                                onChange={(value) => {
                                    if (value) {
                                        setSelectedDegree(value)
                                    }
                                }}
                                by={(degreeA, degreeB) => {
                                    return degreeA.degreeName === degreeB.degreeName && degreeA.degreeYear === degreeB.degreeYear
                                }}
                                as="div"
                                className="w-fit"
                            >
                                <div>
                                    <ComboboxInput
                                        onChange={(event) => {
                                            setQuery(event.target.value)
                                        }}
                                        displayValue={(degree: Degree) => {
                                            if (degree.degreeName === "" && degree.degreeYear === "") {
                                                return ""
                                            }
                                            return degree.degreeName + " " + degree.degreeYear
                                        }}
                                        placeholder="Select a degree plan"
                                        className="border-2 border-black rounded-md p-2 h-10 w-full mb-1"
                                    ></ComboboxInput>
                                    <ComboboxOptions static className="border-black border-2 rounded-md w-fit empty:invisible">
                                        {degrees
                                            .filter(degree => degree.planned)
                                            .filter((degree) => {
                                                return `${degree.degreeName} + " " + ${degree.degreeYear}`.toLowerCase().includes(query.toLowerCase())
                                            })
                                            .map((degree) => {
                                                return (
                                                    <ComboboxOption
                                                        key={degree.degreeName + " " + degree.degreeYear}
                                                        value={degree}
                                                        className="hover:bg-gray-200 cursor-pointer px-2 rounded-md"
                                                    >
                                                        {degree.degreeName + " " + degree.degreeYear}
                                                    </ComboboxOption>
                                                )
                                            })}
                                    </ComboboxOptions>
                                </div>
                            </Combobox>

                            {/* Arrow appears next to selection */}
                            {selectedDegree.degreeName !== "" && selectedDegree.degreeYear !== "" &&
                                <NavLink 
                                    to="/" 
                                    className="border-2 border-black rounded-md h-10 px-1 bg-[#e87500] hover:bg-[#c95100]"
                                    onClick={() => {
                                        loadExisitingPlan()
                                    }}
                                    end
                                >
                                    <ChevronDoubleRightIcon className="size-9" color="white"></ChevronDoubleRightIcon>
                                </NavLink>
                            }
                        </div>
                        
                        {/* OR */}
                        <p className="text-2xl">OR</p>
                        
                        <p className="text-xl">Create a new plan</p>
                        <div className="flex flex-row gap-2">
                            {/* Start a new plan */}
                            <Combobox
                                value={newSelectedDegree}
                                onChange={(value) => {
                                    if (value) {
                                        setNewSelectedDegree(value)
                                    }
                                }}
                                by={(degreeA, degreeB) => {
                                    return degreeA.degreeName === degreeB.degreeName && degreeA.degreeYear === degreeB.degreeYear
                                }}
                                as="div"
                                className="w-fit"
                            >
                                <div>
                                    <ComboboxInput
                                        onChange={(event) => {
                                            setNewQuery(event.target.value)
                                        }}
                                        displayValue={(degree: Degree) => {
                                            if (degree.degreeName === "" && degree.degreeYear === "") {
                                                return ""
                                            }
                                            return degree.degreeName + " " + degree.degreeYear
                                        }}
                                        placeholder="Select a degree plan"
                                        className="border-2 border-black rounded-md p-2 h-10 w-full mb-1"
                                    ></ComboboxInput>
                                    <ComboboxOptions static className="border-black border-2 rounded-md w-fit empty:invisible">
                                        {degrees
                                            .filter(degree => !degree.planned)
                                            .filter((degree) => {
                                                return `${degree.degreeName} + " " + ${degree.degreeYear}`.toLowerCase().includes(query.toLowerCase())
                                            })
                                            .map((degree) => {
                                                return (
                                                    <ComboboxOption
                                                        key={degree.degreeName + " " + degree.degreeYear}
                                                        value={degree}
                                                        className="hover:bg-gray-200 cursor-pointer px-2 rounded-md"
                                                    >
                                                        {degree.degreeName + " " + degree.degreeYear}
                                                    </ComboboxOption>
                                                )
                                            })}
                                    </ComboboxOptions>
                                </div>
                            </Combobox>

                            {/* Arrow appears next to selection */}
                            {newSelectedDegree.degreeName !== "" && newSelectedDegree.degreeYear !== "" &&
                                <NavLink 
                                    to="/" 
                                    className="border-2 border-black rounded-md h-10 px-1 bg-[#e87500] hover:bg-[#c95100]"
                                    onClick={() => {
                                        loadNewPlan()
                                    }}
                                    end
                                >
                                    <ChevronDoubleRightIcon className="size-9" color="white"></ChevronDoubleRightIcon>
                                </NavLink>
                            }
                        </div>

                    </>
                ) : (
                    <>
                        {/* Start a new plan */}
                        <div className="flex flex-col gap-2">
                            {/* Start a new plan */}
                            <Combobox
                                value={newSelectedDegree}
                                onChange={(value) => {
                                    if (value) {
                                        setNewSelectedDegree(value)
                                    }
                                }}
                                by={(degreeA, degreeB) => {
                                    return degreeA.degreeName === degreeB.degreeName && degreeA.degreeYear === degreeB.degreeYear
                                }}
                                as="div"
                                className="w-fit"
                            >
                                <div>
                                    <ComboboxInput
                                        onChange={(event) => {
                                            setNewQuery(event.target.value)
                                        }}
                                        displayValue={(degree: Degree) => {
                                            if (degree.degreeName === "" && degree.degreeYear === "") {
                                                return ""
                                            }
                                            return degree.degreeName + " " + degree.degreeYear
                                        }}
                                        placeholder="Select a degree plan"
                                        className="border-2 border-black rounded-md p-2 h-10 w-full mb-1"
                                    ></ComboboxInput>
                                    <ComboboxOptions static className="border-black border-2 rounded-md w-fit empty:invisible">
                                        {degrees
                                            .filter((degree) => {
                                                return `${degree.degreeName} + " " + ${degree.degreeYear}`.toLowerCase().includes(newQuery.toLowerCase())
                                            })
                                            .map((degree) => {
                                                return (
                                                    <ComboboxOption
                                                        key={degree.degreeName + " " + degree.degreeYear}
                                                        value={degree}
                                                        className="hover:bg-gray-200 cursor-pointer px-2 rounded-md"
                                                    >
                                                        {degree.degreeName + " " + degree.degreeYear}
                                                    </ComboboxOption>
                                                )
                                            })}
                                    </ComboboxOptions>
                                </div>
                            </Combobox>

                            {/* Start Planning */}
                            {newSelectedDegree.degreeName !== "" && newSelectedDegree.degreeYear !== "" &&
                                <NavLink 
                                    to="/" 
                                    className="flex flex-row gap-2 items-center justify-between border-2 border-black rounded-md p-2 bg-[#e87500] hover:bg-[#c95100]"
                                    onClick={() => {
                                        loadNewPlan()
                                    }}
                                    end
                                >
                                        <p className="text-white text-2xl font-bold">Start Planning</p>
                                        <ChevronDoubleRightIcon className="size-8" color="white"></ChevronDoubleRightIcon>   
                                </NavLink>
                            }
                        </div>
                    </>
                )}
            </div>
        </>
    )
}

export default SelectPlan