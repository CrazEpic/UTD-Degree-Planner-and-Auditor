import { useState } from "react"
import FindCourseModal from './FindCourseModal'
import FindTransferCredit from "./FindTransferCredit"
import FindTestCredit from "./FindTestCredit"
import { Credit } from "../../../../types/testAndTransferTypes"

const CreditModal = ({ type, close } : { type: string, close(): void }) => {

    // Figure how to pass credit
    const [credit, setCredit] = useState<Credit>({id: "", equivalency: ""})

    return (
        <>
            {credit.id === "" ? (

                // If a credit has not been found, search for a credit
                <>
                    {type === "Transfer" ? (
                        <FindTransferCredit foundCredit={setCredit} closeModal={close}/>
                    ) : (
                        // Currently broken
                        <>
                            {/* <FindTestCredit foundCredit={setCredit} closeModal={close}></FindTestCredit> */}
                        </>
                    )}
                </>
            ) : (

                // If a credit has been found, search by equivalent course
                <FindCourseModal type={type} credit={credit} back={setCredit} closeModal={close}></FindCourseModal>
            )}
        </>
    )
}

export default CreditModal

