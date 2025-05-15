import { DegreePlanCourse, User } from "./degree"

export type Credit = {
    id: string,
    equivalency: string,
}

export type transferSchool = {
	schoolID: string,
	schoolName: string,
	schoolCity: string,
	schoolState: string,
	schoolCountry: string,
}

export type transferCredit = {
    transferCourseEquivalencyID: string,
    transferCourseID: string,
    transferCourseName: string,
    utdCourseEquivalency: string,
    utdCourseEquivalencyName: string,
    transferSchoolSchoolID: string,
}

// Is this necessary?
export type TestCredit = {
    User: User,
    TestEquivalency: TestEquivalency,
    DegreePlanCourse: DegreePlanCourse[],
}

export type TestEquivalency = {
    testComponentID: string,
    testType: string,
    examName: string,
    minScore: string,
    maxScore: string,
    maxClaimableCreditHours: number,
    utdEquivalencyCourses: JSON,
    TestCredit: TestCredit[],
}

// Is this necessary?
export type TransferCredit = {
    User: User,
    TransferCourseEquivalency: TransferCourseEquivalency,
    DegreePlanCourse: DegreePlanCourse[],
}

export type TransferCourseEquivalency = {
    transferCourseEquivalencyID: string,
    courseEquivalency: string,
    TransferCredit: TransferCredit[],
}