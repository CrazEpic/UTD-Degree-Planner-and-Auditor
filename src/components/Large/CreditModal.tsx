import { Button, Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { useContext, useState } from "react"
import { CreditContext } from "../../contexts/CreditContext"
import { Course, CreditContextType, DegreePlan, DegreePlanCourse, Test, TestCredit, Transfer, TransferCredit } from "../../types/degreeTest"
import PlannerCourse from "./Planner/PlannerCourse"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { UserContext } from '../../contexts/UserContext'

// Template values
const schools = ["Collin College", "Grayson College", "Dallas College"]
const courses = [
    ["HIST 1301", "HIST 1302"],
    ["ARTS 1102", "ARTS 2102"],
    ["GEOG 2304", "GEOG 2305"],
]


const types = ["AP", "IB", "CLEP", "A & AS Level"]
const tests = [
    ["Art: History", " Envrionmental Science"],
    ["History - Asia", "Physics Standard Level"],
    ["Precalculus", "Chemistry"],
    ["Biology AS Level"],
]




function createDefaultCourse() : Course  {
    return {
        prefix: "CR",
        number: "1234",
        name: "Course Name",
    }
}


function CreditModal({type}: {type: string}) {

    const creditContext = useContext(CreditContext)
    const plan = useContext(UserContext)?.user?.DegreePlan

    const createDegreePlanCourse = () : DegreePlanCourse => {
        return {
            degreePlanCourseID: "",      
            degreePlanID: "",    
            DegreePlan: (plan as DegreePlan),  
            Course: createDefaultCourse(),    
            prefix: "CR",        
            number: "1234",
        }
    }

    const degreePlanCourses : DegreePlanCourse[] = [
        createDegreePlanCourse(),
        createDegreePlanCourse(),
        createDegreePlanCourse(),
        createDegreePlanCourse(),
    ]

    // Currently just reverts the mask
    // Needs to be implemented

    const [transfer, setTransfer] = useState<Transfer>({
        school: "",
        course: "",
    })
    const [test, setTest] = useState<Test>({
        type: "",
        name: ""
    })


    // If the first and second field are filled and accurate, the form is complete
    const isComplete = () => {
        const transferCredit = schools.indexOf(transfer.school) >= 0
        const first = transferCredit ? schools.indexOf(transfer.school) : types.indexOf(test.type)
        const second = transferCredit ? courses.at(first)?.indexOf(transfer.course) : tests.at(first)?.indexOf(test.type)
        return first >= 0 && second >= 0
    }


    const handleTransferChange = (e) => {
        setTransfer({
            ...transfer,
            [e.target.name]: e.target.value,
        })
    }


    const handleTestChange = (e) => {
        setTest({
            ...test,
            [e.target.name]: e.target.value,
        })
    }


    

   
    if (creditContext?.credit == null) {


        // Credit selection
        return (
            <>
                <div className="flex flex-col items-center w-100 border-2 rounded-lg p-4 gap-4">
                    <h1 className="h-8 text-2xl max-w-100 line-clamp-1 justify-self-start">{type + " Credit Selection"}</h1>
                    <hr className="w-full" />


                    {/* Find a way to indicate second field is disabled until a valid first input is entered */}
                    {type === "Transfer" ? (
                        // Transfer Credit
                        <>
                            <div className="flex flex-row gap-2 items-center w-full">
                                <p>School: </p>
                                <Combobox as="div" value={transfer} onChange={handleTransferChange}>
                                    <ComboboxInput
                                        type="text"
                                        name="school"
                                        onChange={handleTransferChange}
                                        displayValue={(transfer: Transfer) => transfer.school}
                                        placeholder="Search for a school"
                                        className="border-black border rounded-md px-1"
                                    />
                                    <ComboboxOptions className="relative mt-1">
                                        <div className="absolute flex flex-col bg-white w-full h-fit border-2 rounded-md empty:invisible">
                                            {schools.filter((school) => {
                                                if (transfer.school === "" || transfer.school === null) {
                                                    return true
                                                }
                                                return school.toLowerCase().includes(transfer.school.toLowerCase())
                                            }).map((school) => (
                                                <ComboboxOption
                                                    value={school}
                                                    className="hover:bg-gray-200 h-5 w-full cursor-pointer px-1 rounded-md"
                                                    onClick={() => setTransfer({
                                                        ...transfer,
                                                        school: school,
                                                    })}
                                                >
                                                    {school}
                                                </ComboboxOption>
                                            ))}
                                        </div>
                                    </ComboboxOptions>
                                </Combobox>
                            </div>
                            <div className="flex flex-row gap-2 items-center w-full">
                                <p>Course: </p>
                                <Combobox as="div" value={transfer} onChange={handleTransferChange} disabled={!schools.includes(transfer.school)}>
                                    <ComboboxInput
                                        type="text"
                                        name="course"
                                        onChange={handleTransferChange}
                                        displayValue={(transfer: Transfer) => transfer.course}
                                        placeholder="Search for a course"
                                        className="border-black border rounded-md px-1"
                                    />
                                    <ComboboxOptions className="relative mt-1">
                                        <div className="absolute flex flex-col bg-white w-full h-fit border-2 rounded-md empty:invisible">
                                            {
                                                schools.indexOf(transfer.school) >= 0 &&
                                                courses.at(schools.indexOf(transfer.school)).filter((course) => {
                                                    if (transfer.course === "" || transfer.course === null) {
                                                        return true
                                                    }
                                                    return course.toLowerCase().includes(transfer.course.toLowerCase())
                                                }).map((course) => (
                                                    <ComboboxOption
                                                        value={course}
                                                        className="hover:bg-gray-200 h-5 w-full cursor-pointer px-1 rounded-md"
                                                        onClick={() => setTransfer({
                                                            ...transfer,
                                                            course: course,
                                                        })}
                                                    >
                                                        {course}
                                                    </ComboboxOption>
                                                )
                                            )}
                                        </div>
                                    </ComboboxOptions>
                                </Combobox>
                            </div>
                        </>
                    ) : (
                        // CURRENTLY BROKEN FOR SOME REASON
                        
                        // Test Credit
                        <>
                            <div className="flex flex-row gap-2 items-center w-full">
                                <p>Type: </p>
                                <Combobox as="div" value={transfer} onChange={handleTestChange}>
                                <ComboboxInput
                                        type="text"
                                        name="type"
                                        onChange={handleTestChange}
                                        displayValue={(test: Test) => test.type}
                                        placeholder="Search for a test type"
                                        className="border-black border rounded-md px-1"
                                    />
                                    <ComboboxOptions className="relative mt-1">
                                        <div className="absolute flex flex-col bg-white w-full h-fit border-2 rounded-md empty:invisible">
                                            {types.filter((type) => {
                                                if (test.type === "" || test.type === null) {
                                                    return true
                                                }
                                                return type.toLowerCase().includes(test.type.toLowerCase())
                                            }).map((type) => (
                                                <ComboboxOption
                                                    value={type}
                                                    className="hover:bg-gray-200 h-5 w-full cursor-pointer px-1 rounded-md"
                                                    onClick={() => setTest({
                                                        ...test,
                                                        type: type,
                                                    })}
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
                                <Combobox as="div" value={transfer} onChange={handleTestChange} disabled={!types.includes(test.type)}>
                                    <ComboboxInput
                                        type="text"
                                        name="name"
                                        onChange={handleTestChange}
                                        displayValue={(test: Test) => test.name}
                                        placeholder="Search for a test"
                                        className="border-black border rounded-md px-1"
                                    />
                                    <ComboboxOptions className="relative mt-1">
                                        <div className="absolute flex flex-col bg-white w-full h-fit border-2 rounded-md empty:invisible">
                                            {
                                                types.indexOf(test.type) >= 0 &&
                                                tests.at(types.indexOf(test.type)).filter((testName) => {
                                                    if (test.name === "" || test.name === null) {
                                                        return true
                                                    }
                                                    return testName.toLowerCase().includes(test.name.toLowerCase())
                                                }).map((testName) => (
                                                    <ComboboxOption
                                                        value={testName}
                                                        className="hover:bg-gray-200 h-5 w-full cursor-pointer px-1 rounded-md"
                                                        onClick={() => setTest({
                                                            ...test,
                                                            name: testName,
                                                        })}
                                                    >
                                                        {testName}
                                                    </ComboboxOption>
                                                )
                                            )}
                                        </div>
                                    </ComboboxOptions>
                                </Combobox>
                            </div>
                        </>
                    )}
                    <div className="flex flex-row justify-between w-full">
                        <button
                            className="flex flex-row w-fit border bg-red-100 p-1 rounded-lg"
                            onClick={() => {
                                console.log("Cancel Credit")
                                if (creditContext?.close) creditContext.close()
                            }}
                        >
                            Cancel
                        </button>


                        {/* Gray out until the credit is defined */}
                        <button
                            className={"flex flex-row justify-end w-fit border p-1 rounded-lg " + (isComplete() && "bg-green-100")}
                            onClick={() => {
                                console.log("Find Course")
                                if (creditContext?.findCourse) {
                                    if (transfer) {
                                        console.log("Find Transfer")
                                        creditContext.findCourse(transfer)
                                    }
                                    else {
                                        console.log("Find Test")
                                        creditContext.findCourse(test)
                                    }
                                }
                            }}
                            disabled={!isComplete()}
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </>
        )
    }
    else {


        // Course selection for a particular credit
        return (
            <>
                <div className="flex flex-col items-center w-full border-2 rounded-lg p-4 gap-4 min-w-80">
                    <h1 className="h-8 text-xl max-w-100 line-clamp-1">Matching Courses</h1>
                    <hr className="w-full" />
                    <div className="flex flex-col gap-4 w-full px-2">
                        {plan && 
                            <>
                                {degreePlanCourses.map((course) => {
                                    <PlannerCourse course={course}></PlannerCourse>
                                })}
                            </>
                        }
                    </div>
                    <div className="flex flex-row justify-between w-full">
                        <button
                            className="flex flex-row w-fit border bg-red-100 p-1 rounded-lg"
                            onClick={() => {
                                console.log("Cancel Credit")
                                if (creditContext?.close) creditContext.close()
                            }}
                        >
                            Back
                        </button>


                        {/* Gray out when not all hours are linked */}
                        <button
                            className={"flex flex-row justify-end w-fit border p-1 rounded-lg " + (isComplete() && "bg-green-100")}
                            onClick={() => {
                                console.log("Submit Credit")
                                if (creditContext?.findCourse) {
                                    if (transfer) {
                                        creditContext.findCourse(transfer)
                                    }
                                    else {
                                        creditContext.findCourse(test)
                                    }
                                }
                            }}
                            disabled={!isComplete()}
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </>
        )
    }
}


export default CreditModal

