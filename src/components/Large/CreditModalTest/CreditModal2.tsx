import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { useContext, useState } from "react"
import { CreditContext } from "../../../contexts/CreditContext"
import { Course, DegreePlan, DegreePlanCourse, Test, Transfer } from "../../../types/degreeTest"
import PlannerCourse from "../Planner/PlannerCourse"
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline"
import { UserContext } from '../../../contexts/UserContext'
import FindCreditModal from './FindCreditModal'
import FindCourseModal from './FindCourseModal'

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


// TODO: Finish separating the modals
const CreditModal2 = ({type} : {type: string}) => {

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

    const handleChange = (e) => {
        if (type === "Transfer") {
            setTransfer({
                ...transfer,
                [e.target.name]: e.target.value,
            })
        }
        else {
            setTest({
                ...test,
                [e.target.name]: e.target.value,
            })
        }
    }

    return (
        <>
            {creditContext?.credit ? (
                <>
                    <FindCourseModal type={type}></FindCourseModal>
                </>
            ) : (

                // Componentize the Transfer and Test Credit modals
                <>
                    <FindCreditModal
                        type={type}
                        credit={ type === "Transfer" ? transfer : test }
                        updateCredit={ type === "Transfer" ? setTransfer : setTest}
                    ></FindCreditModal>

                    {type === "Transfer" ? (
                        <>
                            {/* Find Transfer Credit */}
                        </>
                    ) : (
                        <>
                            {/* Find Test Credit */}
                        </>
                    )}
                </>
            )}
        </>
    )
}

export default CreditModal2

