import { DegreePlanCourse, User } from "./degree"

export type Transfer = {
    school: string
    course: string
}

export type Test = {
    type: string
    name: string
}

export type TestCredit = {
    User: User
    TestEquivalency: TestEquivalency
    DegreePlanCourse: DegreePlanCourse[]
}

export type TestEquivalency = {
    testComponentID: string
    courseEquivalency: JSON
    maxClaimableCreditHours: number
    TestCredit: TestCredit[]
}

export type TransferCredit = {
    User: User
    TransferCourseEquivalency: TransferCourseEquivalency
    DegreePlanCourse: DegreePlanCourse[]
}

export type TransferCourseEquivalency = {
    transferCourseEquivalencyID: string
    courseEquivalency: string
    TransferCredit: TransferCredit[]
}