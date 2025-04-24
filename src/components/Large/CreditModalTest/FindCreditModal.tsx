import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { useContext, useState } from "react"
import { CreditContext } from "../../../contexts/CreditContext"
import { Course, DegreePlan, DegreePlanCourse, Test, Transfer } from "../../../types/degreeTest"
import PlannerCourse from "../Planner/PlannerCourse"
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline"
import { UserContext } from '../../../contexts/UserContext'

// TODO: Replace template with real values (from context / API call)
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

const FindCreditModal = ({
    credit,
    updateCredit,
    type
} : {
    credit: Transfer | Test,
    updateCredit: any,
    type: string}) => {

    const creditContext = useContext(CreditContext)
    const plan = useContext(UserContext)?.user?.DegreePlan

    // If the first and second field are filled and accurate, the form is complete
    const isComplete = () => {
        let first = -1
        let second = -1
        if (type === "Transfer") {
            first = schools.indexOf(transfer.school)
            second = (courses.at(first)?.indexOf(transfer.course) as number)
        }
        else {
            first = types.indexOf(test.type)
            second = (tests.at(first)?.indexOf(test.type) as number)
        }
        return first >= 0 && second >= 0
    }

    const handleChange = (e) => {
        updateCredit({
            ...credit,
            [e.target.name]: e.target.value,
        })
    }


    // Credit selection
    return (
        <>
            <div className="flex flex-col items-center w-100 border-2 rounded-lg p-4 gap-4">
                <h1 className="h-8 text-2xl max-w-100 line-clamp-1 justify-self-start">{type + " Credit Selection"}</h1>
                <hr className="w-full" />


                {/* TODO: Find a way to indicate second field is disabled until a valid first input is entered */}
                {type === "Transfer" ? (
                    // Transfer Credit
                    <>
                        <div className="flex flex-row gap-2 items-center w-full">
                            <p>School: </p>
                            <Combobox as="div" value={credit} onChange={handleChange}>
                                <ComboboxInput
                                    type="text"
                                    name="school"
                                    onChange={handleChange}
                                    displayValue={(transfer: Transfer) => transfer.school}
                                    placeholder="Search for a school"
                                    className="border-black border rounded-md px-1"
                                />
                                <ComboboxOptions className="relative mt-1">
                                    <div className="absolute flex flex-col bg-white w-full h-fit border-2 rounded-md empty:invisible">
                                        {schools.filter((school) => {
                                            if (credit.school === "" || credit.school === null) {
                                                return true
                                            }
                                            return school.toLowerCase().includes(credit.school.toLowerCase())
                                        }).map((school) => (
                                            <ComboboxOption
                                                value={school}
                                                className="hover:bg-gray-200 h-5 w-full cursor-pointer px-1 rounded-md"
                                                onClick={() => updateCredit({
                                                    ...credit,
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
                            <Combobox as="div" value={credit} onChange={handleChange} disabled={!schools.includes(credit.school)}>
                                <ComboboxInput
                                    type="text"
                                    name="course"
                                    onChange={handleChange}
                                    displayValue={(transfer: Transfer) => transfer.course}
                                    placeholder="Search for a course"
                                    className="border-black border rounded-md px-1"
                                />
                                <ComboboxOptions className="relative mt-1">
                                    <div className="absolute flex flex-col bg-white w-full h-fit border-2 rounded-md empty:invisible">
                                        {
                                            schools.indexOf(credit.school) >= 0 &&
                                            courses.at(schools.indexOf(credit.school)).filter((course) => {
                                                if (credit.course === "" || credit.course === null) {
                                                    return true
                                                }
                                                return course.toLowerCase().includes(credit.course.toLowerCase())
                                            }).map((course) => (
                                                <ComboboxOption
                                                    value={course}
                                                    className="hover:bg-gray-200 h-5 w-full cursor-pointer px-1 rounded-md"
                                                    onClick={() => updateCredit({
                                                        ...credit,
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
                    // TODO: Fix type/test to work like school/course does
                    
                    // Test Credit
                    <>
                        <div className="flex flex-row gap-2 items-center w-full">
                            <p>Type: </p>
                            <Combobox as="div" value={credit} onChange={handleChange}>
                            <ComboboxInput
                                    type="text"
                                    name="type"
                                    onChange={handleChange}
                                    displayValue={(test: Test) => test.type}
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
                                                onClick={() => updateCredit({
                                                    ...credit,
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
                            <Combobox as="div" value={credit} onChange={handleChange} disabled={!types.includes(credit.type)}>
                                <ComboboxInput
                                    type="text"
                                    name="name"
                                    onChange={handleChange}
                                    displayValue={(test: Test) => test.name}
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
                                                    onClick={() => updateCredit({
                                                        ...credit,
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
                            if (creditContext?.findCourse) {
                                console.log("Find " + type + " Course Equivalent")
                                creditContext.findCourse(credit)
                            }
                        }}
                        disabled={!isComplete()}
                    >
                        Next
                        <ChevronRightIcon className="size-6 max-lg:size-8"></ChevronRightIcon>
                    </button>
                </div>
            </div>
        </>
    )
}

export default FindCreditModal

