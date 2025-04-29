import { Dispatch, SetStateAction, useContext, useState } from "react"
import { CreditContext } from "../../../contexts/CreditContext"
import { Test, Transfer } from "../../../types/degreeTest"
import FindCourseModal from './FindCourseModal'
import FindTransferCredit from "./FindTransferCredit"
import FindTestCredit from "./FindTestCredit"

// TODO: Finish separating the modals
const CreditModal2 = ({type} : {type: string}) => {

    // TODO: Define where these functions need to be accessible to finish this
    const creditContext = useContext(CreditContext)

    // Figure how to pass credit
    const [credit, setCredit] = useState<Transfer | Test | null>(null)

    return (
        <>
            {credit ? (
                // If a credit has been found, search by equivalent course
                <FindCourseModal type={type} back={setCredit as Dispatch<SetStateAction<null>>}></FindCourseModal>
            ) : (

                // If a credit has not been found, search for a credit
                <>
                    {type === "Transfer" ? (
                        <FindTransferCredit foundCredit={setCredit as Dispatch<SetStateAction<Transfer>>}/>
                    ) : (
                        <FindTestCredit foundCredit={setCredit as Dispatch<SetStateAction<Test>>}></FindTestCredit>
                    )}
                </>
            )}
        </>
    )
}

export default CreditModal2

