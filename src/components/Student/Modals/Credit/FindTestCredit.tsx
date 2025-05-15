import { useEffect, useState } from 'react'
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions, Input, Select } from '@headlessui/react'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { createDefaultTestEquivalency } from '../../../../utils/testAndTransferUtils'
import { TestEquivalency } from '../../../../types/testAndTransferTypes'

// Should come back as TestEquivalency[]
const fetchTests = async () => {
    try {
        // API call for tests
        // return response.data
        return []
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

    const [testType, setTestType] = useState<string>("")
    
    const [tests, setTests] = useState<TestEquivalency[]>([])
    const [testQuery, setTestQuery] = useState<string>("")
    const [selectedTest, setSelectedTest] = useState<TestEquivalency>(createDefaultTestEquivalency())

    const [scoreRange, setScoreRange] = useState({min: -1, max: -1})
    const [grade, setGrade] = useState(0)

    useEffect(() => {
        const load = async () => {
            const data = await fetchTests()
            setTests(data)
        }

        load()
        if (scoreRanges.findIndex((range) => range.type === testType)) {
            const range = scoreRanges.find((range) => range.type === testType)
            setScoreRange({ min: (range?.min as number), max: (range?.max as number)})
        }
    })

    const isCompleted = () : boolean => {
        return selectedTest.testType === testType
    }

    return (
        <>
            <div className="flex flex-col items-center w-80 border-2 rounded-lg p-4 gap-4">
                <h1 className="h-8 text-2xl max-w-80 line-clamp-1 justify-self-start">Transfer Credit Selection</h1>
                <hr className="w-full" />
                <div className="flex flex-row gap-2 items-center w-full">
                    <p>Type: </p>
                    <Select value={testType} onChange={() => setTestType}>
                        {testTypes.map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </Select>
                </div>
                <div className="flex flex-row gap-2 items-center w-full">
                    <p>Test: </p>
                    <Combobox 
                        as="div" 
                        value={selectedTest} 
                        onChange={(value: TestEquivalency) => {
                            setSelectedTest(value)
                            if (value === null || selectedTest.testComponentID === "") {
                                setTestQuery("")
                                return
                            }
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
                                    .filter((test) => test.testType === testType)
                                    .filter((test) => {
                                        if (testQuery === "" || testQuery === null) {
											return true
										}
										return test.examName.toLowerCase().includes(testQuery.toLowerCase())
                                    })
                                    .slice(0, 50)
                                    .map((test) => (
                                        <ComboboxOption
                                            value={test.examName}
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
                        min={scoreRange.min}
                        max={scoreRange.max}
                        defaultValue={scoreRange.min}
                        value={grade}
                        onChange={() => setGrade}
                        placeholder="Enter your grade"
                        disabled={selectedTest.examName === ""}
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