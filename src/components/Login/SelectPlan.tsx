import { useState } from "react"
import { NavLink } from "react-router"
import { Combobox, ComboboxOptions, ComboboxOption, ComboboxInput } from "@headlessui/react"
import { ChevronDoubleRightIcon } from "@heroicons/react/24/outline"

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

const SelectPlan = ({ existingUser }: { existingUser: boolean }) => {

    const [selectedDegree, setSelectedDegree] = useState<Degree>({degreeName: "", degreeYear: ""})
    const [newSelectedDegree, setNewSelectedDegree] = useState<Degree>({degreeName: "", degreeYear: ""})
    const [query, setQuery] = useState("")
 
    const loadNewPlan = () => {
        // API Call
    }

    const loadExisitingPlan = () => {

    }

    const filterDegree = (degree: Degree, option: string) => {
        switch(option) {
            case "PLANNED":
                return degree.planned
            case "UNPLANNED":
                return !degree.planned
            default:
                return true
        }
    }

    const renderDegreeSelect = (option: string, selected: Degree, update: Function) => {
        return (
            <Combobox
                value={selected}
                onChange={(value) => {
                    if (value) {
                        update(value)
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
                    />
                    <ComboboxOptions static className="border-black border-2 rounded-md w-fit empty:invisible">
                        {degrees
                            .filter(degree => filterDegree(degree, option))
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
                            })
                        }
                    </ComboboxOptions>
                </div>
            </Combobox>
        )
    }

    return (
        <>
            <div className="absolute flex flex-col gap-2 items-center border-2 border-black rounded-lg w-8/10 max-w-100 h-fit inset-0 m-auto p-4 py-8 bg-white">
                {existingUser ? (
                    <> 
                        <p className="text-xl">Select an active plan</p>
                        <div className="flex flex-row gap-2">

                            {/* Select a degree plan (work on wording) */}
                            {renderDegreeSelect("PLANNED", selectedDegree, setSelectedDegree)}

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
                            {renderDegreeSelect("UNPLANNED", newSelectedDegree, setNewSelectedDegree)}

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
                        <div className="flex flex-col gap-2">

                            {/* Start a new plan */}
                            {renderDegreeSelect("ALL", newSelectedDegree, setNewSelectedDegree)}

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