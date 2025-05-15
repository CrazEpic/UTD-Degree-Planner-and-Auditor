import { useEffect, useState } from 'react'
import axios from 'axios'
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions, Input } from '@headlessui/react'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { createDefaultTestEquivalency } from '../../../../utils/testAndTransferUtils'
import { scoreRange, TestEquivalency } from '../../../../types/testAndTransferTypes'

// Should come back as TestEquivalency[]
const fetchTests = async () => {
    try {
        const response = await axios.get("/api/testAndTransferCredits/testCreditEquivalencies")
        return response.data
    } catch (error) {
        console.error("Failed to fetch schools: ", error)
		return []
    }
}

// TODO: ALSO update for grade input as well
const FindTransferCredit = ({ 
    foundCredit, 
    closeModal 
} : { 
    foundCredit: Function, 
    closeModal(): void 
}) => {

    // If types change we can account for that, or have this in the DB somewhere?
    const testTypes = ["AP", "IB", "CLEP", "A & AS Level"]
    const scoreRanges = [
        {
            type: "AP",
            min: 1,
            max: 5,
        },
        {
            type: "IB",
            min: 1,
            max: 7,
        },
        {
            type: "CLEP",
            min: 20,
            max: 80,
        },
        {
            type: "A & AS Level",
            min: 1,
            max: 5,
        },
    ]

    const [typeQuery, setTypeQuery] = useState<string>("")
    const [selectedType, setSelectedType] = useState<string>("")
    
    const [tests, setTests] = useState<TestEquivalency[]>([])
    const [testQuery, setTestQuery] = useState<string>("")
    const [selectedTest, setSelectedTest] = useState<TestEquivalency>(createDefaultTestEquivalency())

    const [range, setRange] = useState<scoreRange>({type: "", min: 0, max: 0})
    const [grade, setGrade] = useState(0)

    useEffect(() => {
        const load = async () => {
            const data = await fetchTests()
            setTests(data)
        }

        load()
        setSelectedType(testTypes[0])
    }, [])

    useEffect(() => {
        if (scoreRanges.findIndex((range) => range.type === selectedType) >= 0) {
            setRange(scoreRanges.find((range) => range.type === selectedType) as scoreRange)
        }
        setGrade(range.min)
    }, [selectedType])

    const isCompleted = () : boolean => {
        return selectedTest !== null && selectedTest.testType === selectedType && grade >= parseInt(selectedTest.minScore)
    }

    return (
        <>
            <div className="flex flex-col items-center w-80 border-2 rounded-lg p-4 gap-4">
                <h1 className="h-8 text-2xl max-w-80 line-clamp-1 justify-self-start">Test Credit Selection</h1>
                <hr className="w-full" />
                <div className="flex flex-row gap-2 items-center w-full">
                    <p>Type: </p>
                    <Combobox 
                        as="div" 
                        value={selectedType} 
                        onChange={(value: string) => {
                            setSelectedType(value)
                            if (value === null) {
                                setTypeQuery("")
                                return
                            }
                        }}
                    >
                        <ComboboxInput
                            type="text"
                            name="type"
                            onChange={(e) => {
                                setTypeQuery(e.target.value)
                            }}
                            placeholder="Filter by test type"
                            className="border-black border rounded-md px-1"
                        />
                        <ComboboxOptions className="relative mt-1 z-20">
                            <div className="absolute flex flex-col bg-white w-full max-h-60 overflow-y-auto border-2 rounded-md empty:invisible">
                                {testTypes
                                    .filter((type) => {
                                        if (typeQuery === "" || typeQuery === null) {
											return true
										}
										return type.toLowerCase().includes(typeQuery.toLowerCase())
                                    })
                                    .map((type) => (
                                        <ComboboxOption value={type}>{type}</ComboboxOption>
                                    )
                                )}
                            </div>
                        </ComboboxOptions>
                    </Combobox>
                </div>
                <div className="flex flex-row gap-2 items-center w-full">
                    <p>Test: </p>
                    <Combobox 
                        as="div" 
                        value={selectedTest} 
                        onChange={(value: TestEquivalency) => {
                            if (value === null) {
                                setTestQuery("")
                                return
                            }
                            setSelectedTest(value)
                        }}
                    >
                        <ComboboxInput
                            type="text"
                            name="name"
                            onChange={(e) => {
                                setTestQuery(e.target.value)
                            }}
                            placeholder="Search for a test"
                            className="border-black border rounded-md px-1"
                        />
                        <ComboboxOptions className="relative mt-1 z-20">
                            <div className="absolute flex flex-col bg-white w-full max-h-60 overflow-y-auto border-2 rounded-md empty:invisible">
                                {tests
                                    .filter((test) => test.testType === selectedType)
                                    .filter((test) => {
                                        if (testQuery === "" || testQuery === null) {
											return true
										}
										return test.examName.toLowerCase().includes(testQuery.toLowerCase())
                                    })
                                    .slice(0, 50)
                                    .map((test) => (
                                        <ComboboxOption
                                            value={test}
                                            className="hover:bg-gray-200 w-full cursor-pointer px-1 rounded-md"
                                        >
                                            {test.examName}
                                        </ComboboxOption>
                                    ))
                                }
                            </div>
                        </ComboboxOptions>
                    </Combobox>
                </div>

                <div className="flex flex-row gap-2 items-center w-full">
                    <p>Grade: </p>
                    <Input
                        type="number"
                        name="grade"
                        min={range !== null ? range.min : -1}
                        max={range !== null ? range.max : -1}
                        onChange={() => setGrade}
                        placeholder="Enter your grade"
                        disabled={selectedTest !== null}
                        className="border border-black rounded-md"
                    />
                </div>

                {/* Restyle the buttons */}
                <div className="flex flex-row justify-between w-full">
                    <button
                        className="flex flex-row w-fit border bg-red-100 p-1 rounded-lg"
                        onClick={() => {
                            console.log("Cancel Credit")
                            closeModal()
                        }}
                    >
                        Cancel
                    </button>

                    {/* Gray out until the credit is defined */}
                    <button
                        className={"flex flex-row justify-end w-fit border pl-1 rounded-lg " + (isCompleted() && "bg-green-100")}
                        onClick={() => {
                            foundCredit({
                                id: selectedTest.testComponentID,
                                equivalency: selectedTest.utdEquivalencyCourses,
                            })
                        }}
                        disabled={!isCompleted()}
                    >
                        Next
                        <ChevronRightIcon className="size-8"></ChevronRightIcon>
                    </button>
                </div>
            </div>
        </>
    )
}

export default FindTransferCredit