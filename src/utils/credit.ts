import { DegreePlanCourse, Test, TestCredit, TestEquivalency, Transfer, TransferCourseEquivalency, TransferCredit, User } from "../types/degreeTest"

const createTransferEquivalency = () : TransferCourseEquivalency => {
    return {
        externalSchool: "",
        externalCourseID: "",
        courseEquivalency: JSON,
        TransferCredit: [],
    }
}

const createTestEquivalency = () : TestEquivalency => {
    return {
        testComponentID: "",
        courseEquivalency: JSON,
        maxClaimableCreditHours: 0,
        TestCredit: [],
    }
}

const createNewTransferCredit = () : TransferCredit => {
    return {
        User: {
            userID: "",
            username: "",
            TestCredits: [],
            TransferCredits: [],
        },
        TransferCourseEquivalency: createTransferEquivalency(),
        DegreePlanCourse: [],
    }
}

const createNewTestCredit = () : TestCredit => {
    return {
        User: {
            userID: "",
            username: "",
            TestCredits: [],
            TransferCredits: [],
        },
        TestEquivalency: createTestEquivalency(),
        DegreePlanCourse: [],
    }
}


// TODO: Implement these functions with API calls
const getTransferCredit = (credit: Transfer) : TransferCourseEquivalency => {
    
    // Find the transfer equivalency based on the school and course name

    return createTransferEquivalency()
}

const getTestCredit = (credit: Test) : TestEquivalency => {

    // Find the test equivalency based on the test type and name

    return createTestEquivalency()
}

// Still needs an argument to work with
const getEquivalentCourses = () : DegreePlanCourse[] => {

    // Get the coruses that are equivalent to the given credit

    return []
}

// Converts Transfer -> TransferCredit and Test -> TestCredit
export const convertCredit = (credit: Test | Transfer | null, user: User) : TestCredit | TransferCredit | null => {
    if (credit) {
        if ((credit as Transfer).course) {
            let transferCredit = createNewTransferCredit()
            transferCredit.User = user
            transferCredit.TransferCourseEquivalency = getTransferCredit(credit as Transfer)
            transferCredit.DegreePlanCourse = getEquivalentCourses()
            return transferCredit
        }
        else {
            let testCredit = createNewTestCredit()
            testCredit.User = user
            testCredit.TestEquivalency = getTestCredit(credit as Test)
            testCredit.DegreePlanCourse = getEquivalentCourses()
            return testCredit
        }
    }
    return null
}