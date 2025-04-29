import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { Transfer } from "../../../types/degreeTest"
import { Dispatch, SetStateAction, useContext, useState } from 'react'
import { ChevronRightIcon } from '@heroicons/react/24/outline'

const schools = ["Collin College", "Grayson College", "Dallas College"]
const courses = [
    ["HIST 1301", "HIST 1302"],
    ["ARTS 1102", "ARTS 2102"],
    ["GEOG 2304", "GEOG 2305"],
]

const FindTransferCredit = ({ foundCredit, closeModal } : { foundCredit: Dispatch<SetStateAction<Transfer>>, closeModal(): void }) => {

    const [credit, setCredit] = useState<Transfer>({school: "", course: "",})

    const isCompleted = () : boolean => {
        const schoolIndex = schools.indexOf(credit.school)
        return schoolIndex >= 0 && courses.at(schoolIndex)[0] === credit.course
    }

    return (
        <>
            <div className="flex flex-col items-center w-100 border-2 rounded-lg p-4 gap-4">
                <h1 className="h-8 text-2xl max-w-100 line-clamp-1 justify-self-start">Transfer Credit Selection</h1>
                <hr className="w-full" />
                <div className="flex flex-row gap-2 items-center w-full">
                    <p>School: </p>
                    <Combobox 
                        as="div" 
                        value={credit.school} 
                        onChange={(value) => {
                            setCredit((prev) => (
                                { 
                                    ...prev, 
                                    school: value ?? ""
                                }
                            ))
                        }}
                    >
                        <ComboboxInput
                            type="text"
                            name="school"
                            onChange={(e) => setCredit({
                                ...credit,
                                [e.target.name]: e.target.value,
                            })}
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
                    <Combobox 
                        as="div" 
                        value={credit.course} 
                        onChange={(value) => {
                            setCredit((prev) => (
                                { 
                                    ...prev, 
                                    course: value ?? ""
                                }
                            ))
                        }}
                        disabled={!schools.includes(credit.school)}>
                        <ComboboxInput
                            type="text"
                            name="course"
                            onChange={(e) => setCredit({
                                ...credit,
                                [e.target.name]: e.target.value,
                            })}
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
                                        >
                                            {course}
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
                        className={"flex flex-row justify-end w-fit border p-1 rounded-lg " + (isCompleted() && "bg-green-100")}
                        onClick={() => {
                            foundCredit(credit)
                        }}
                        disabled={!isCompleted()}
                    >
                        Next
                        <ChevronRightIcon className="size-6 max-lg:size-8"></ChevronRightIcon>
                    </button>
                </div>
            </div>
        </>
    )
}

export default FindTransferCredit