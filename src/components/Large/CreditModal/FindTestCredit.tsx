import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { Test } from "../../../types/testAndTransferTypes"
import { useState } from 'react'
import { ChevronRightIcon } from '@heroicons/react/24/outline'

// Template code to be replaced
const types = ["AP", "IB", "CLEP", "A & AS Level"]
const tests = [
    ["Art: History", " Envrionmental Science"],
    ["History - Asia", "Physics Standard Level"],
    ["Precalculus", "Chemistry"],
    ["Biology AS Level"],
]


// TODO: Update this for the new API Calls and credit formatting
// TODO: ALSO update for grade input as well
const FindTransferCredit = ({ 
    foundCredit, 
    closeModal 
} : { 
    foundCredit: Function, 
    closeModal(): void 
}) => {

    const [credit, setCredit] = useState<Test>({type: "", name: ""})

    const isCompleted = () : boolean => {
        const typeIndex = types.indexOf(credit.type)
        return typeIndex >= 0 && tests.at(typeIndex)[0] === credit.name
    }

    return (
        <>
            <div className="flex flex-col items-center w-80 border-2 rounded-lg p-4 gap-4">
                <h1 className="h-8 text-2xl max-w-80 line-clamp-1 justify-self-start">Transfer Credit Selection</h1>
                <hr className="w-full" />
                <div className="flex flex-row gap-2 items-center w-full">
                    <p>Type: </p>
                    <Combobox 
                        as="div" 
                        value={credit.type} 
                        onChange={(value) => {
                            setCredit((prev) => (
                                { 
                                    ...prev, 
                                    type: value ?? ""
                                }
                            ))
                        }}
                    >
                        <ComboboxInput
                            type="text"
                            name="type"
                            onChange={(e) => setCredit({
                                ...credit,
                                [e.target.name]: e.target.value,
                            })}
                            placeholder="Search for a test type"
                            className="border-black border rounded-md px-1"
                        />
                        <ComboboxOptions className="relative mt-1">
                            <div className="absolute flex flex-col bg-white w-full h-fit border-2 rounded-md empty:invisible">
                                {types.filter((type) => {
                                    if (credit.type === "" || credit.type === null) {
                                        return true
                                    }
                                    return type.toLowerCase().includes(credit.type.toLowerCase())
                                }).map((type) => (
                                    <ComboboxOption
                                        value={type}
                                        className="hover:bg-gray-200 h-5 w-full cursor-pointer px-1 rounded-md"
                                    >
                                        {type}
                                    </ComboboxOption>
                                ))}
                            </div>
                        </ComboboxOptions>
                    </Combobox>
                </div>
                <div className="flex flex-row gap-2 items-center w-full">
                    <p>Test: </p>
                    <Combobox 
                        as="div" 
                        value={credit.name} 
                        onChange={(value) => {
                            setCredit((prev) => (
                                { 
                                    ...prev, 
                                    name: value ?? ""
                                }
                            ))
                        }}
                        disabled={!types.includes(credit.type)}>
                        <ComboboxInput
                            type="text"
                            name="name"
                            onChange={(e) => setCredit({
                                ...credit,
                                [e.target.name]: e.target.value,
                            })}
                            placeholder="Search for a test"
                            className="border-black border rounded-md px-1"
                        />
                        <ComboboxOptions className="relative mt-1">
                            <div className="absolute flex flex-col bg-white w-full h-fit border-2 rounded-md empty:invisible">
                                {
                                    types.indexOf(credit.type) >= 0 &&
                                    tests.at(types.indexOf(credit.type)).filter((testName) => {
                                        if (credit.name === "" || credit.name === null) {
                                            return true
                                        }
                                        return testName.toLowerCase().includes(credit.name.toLowerCase())
                                    }).map((testName) => (
                                        <ComboboxOption
                                            value={testName}
                                            className="hover:bg-gray-200 h-5 w-full cursor-pointer px-1 rounded-md"
                                        >
                                            {testName}
                                        </ComboboxOption>
                                    )
                                )}
                            </div>
                        </ComboboxOptions>
                    </Combobox>
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
                            foundCredit(credit)
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