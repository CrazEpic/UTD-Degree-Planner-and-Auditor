import { Dispatch, SetStateAction, useState } from "react"
import { Test, Transfer } from "../../../types/degreeTest"
import FindCourseModal from './FindCourseModal'
import FindTransferCredit from "./FindTransferCredit"
import FindTestCredit from "./FindTestCredit"

const CreditModal = ({ type, close } : { type: string, close(): void }) => {

    // Figure how to pass credit
    const [credit, setCredit] = useState<Transfer | Test | null>(null)

    return (
        <>
            {credit ? (
                // If a credit has been found, search by equivalent course
                <FindCourseModal type={type} back={setCredit as Dispatch<SetStateAction<null>>} closeModal={close}></FindCourseModal>
            ) : (

                // If a credit has not been found, search for a credit
                <>
                    {type === "Transfer" ? (
                        <FindTransferCredit foundCredit={setCredit as Dispatch<SetStateAction<Transfer>>} closeModal={close}/>
                    ) : (
                        <FindTestCredit foundCredit={setCredit as Dispatch<SetStateAction<Test>>} closeModal={close}></FindTestCredit>
                    )}
                </>
            )}
        </>
    )
}

export default CreditModal

