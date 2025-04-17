import { Button, Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { useContext } from "react"
import { CreditContext } from "../../contexts/CreditContext"
import { TestCredit } from "../../types/degreeTest"
import PlannerCourse from "./Planner/PlannerCourse"
import { XMarkIcon } from "@heroicons/react/24/outline"

function CreditModal({type}: {type: string}) {

    // Some function to update credit with the credit type

    // Currently just reverts the mask
    // Needs to be implemented
    const credit = useContext(CreditContext)?.credit
    const closeModal = useContext(CreditContext)?.end
    if (!credit) {
        return (
            // Credit Lookup
            <>
                <div className="flex flex-col items-center w-100 border-2 rounded-lg p-4 gap-4">
                    <div className="flex flex-row justify-between w-full">
                        <h1 className="h-8 text-2xl max-w-100 line-clamp-1 justify-self-start">Credit Selection</h1>
                        <Button 
                            className="" 
                            onClick={() => {
                                if(closeModal) closeModal()
                            }}
                        >
                            <XMarkIcon className="size-8"></XMarkIcon>
                        </Button>
                    </div>
                    
                    <hr />
                    {type === "Transfer" ? (
                        // Transfer Credit
                        <>
                            <div className="flex flex-row items-center w-full">
                                <p>School</p>
                                <Combobox>
                                    <ComboboxInput />
                                    <ComboboxOptions>
                                        <ComboboxOption value={""}></ComboboxOption>
                                        <ComboboxOption value={""}></ComboboxOption>
                                    </ComboboxOptions>
                                </Combobox>
                            </div>
                            <div className="flex flex-row items-center w-full">
                                <p>Course</p>
                                <Combobox>
                                    <ComboboxInput />
                                    <ComboboxOptions>
                                        <ComboboxOption value={""}></ComboboxOption>
                                        <ComboboxOption value={""}></ComboboxOption>
                                    </ComboboxOptions>
                                </Combobox>
                            </div>
                        </>
                    ) : (
                        // Test Credit
                        <>
                            <div className="flex flex-row items-center w-full">
                                <p>Type</p>
                                <Combobox>
                                    <ComboboxInput />
                                    <ComboboxOptions>
                                        <ComboboxOption value={""}></ComboboxOption>
                                        <ComboboxOption value={""}></ComboboxOption>
                                    </ComboboxOptions>
                                </Combobox>
                            </div>
                            <div className="flex flex-row items-center w-full">
                                <p>Test</p>
                                <Combobox>
                                    <ComboboxInput />
                                    <ComboboxOptions>
                                        <ComboboxOption value={""}></ComboboxOption>
                                        <ComboboxOption value={""}></ComboboxOption>
                                    </ComboboxOptions>
                                </Combobox>
                            </div>
                        </>

                    )}
                </div>
            </>
        )
    }
    
    return (
        <>
            <div className="flex flex-col items-center w-full border-2 rounded-lg p-4 gap-4">
                <div className="flex flex-row justify-between w-full gap-2">
                    <h1 className="h-8 text-xl max-w-100 line-clamp-1">Credit Selection</h1>
                </div>
                <p className="text-lg">Matching Requirements</p>
                <hr className="w-full" />
                <div className="flex flex-col gap-4 w-full px-2">
                    {(credit as TestCredit).DegreePlanCourse.map((course) => 
                        <>
                            <PlannerCourse course={course}></PlannerCourse>
                        </>
                    )}
                </div>
                <div className="flex flex-row justify-between w-full">
                    {/* Buttons for course selection */}
                </div>
            </div>
        </>
    )
}

export default CreditModal