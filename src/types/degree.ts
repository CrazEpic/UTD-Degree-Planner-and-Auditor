import { Block } from "./block"
import { TestCredit, TransferCredit } from "./testAndTransfer"

export type Course = {
	id: string
	prefix: string
	number: string
	name: string
}

export enum SemesterTerm {
	FALL = 0,
	SPRING = 1,
	SUMMER = 2,
}

export type Mode = "NORMAL" | "EDIT" | "VIEW"

export type User = {
	userID: string
	username: string
	TestCredits: TestCredit[]
	TransferCredits: TransferCredit[]
	DegreePlan?: DegreePlan
}

export type DegreePlan = {
	degreePlanID: string
	startSemesterTerm: SemesterTerm
	startSemesterYear: string
	endSemesterTerm: SemesterTerm
	endSemesterYear: string
	userID: string
	// User:              User,
	name: string
	Degree: Degree
	degreeName: string
	degreeYear: string
	DegreePlanCourses: DegreePlanCourse[]
	// selectionOptions:  Json,
}

export type DegreePlanCourse = {
	degreePlanCourseID: string
	degreePlanID: string
	DegreePlan: DegreePlan
	Course: Course
	prefix: string
	number: string
	// only applicable for courses at
	semesterYear?: string
	semesterTerm?: SemesterTerm
	// both test and transfer uses us
	userID?: string
	// only applicable for test credit
	TestCredit?: TestCredit
	testComponentID?: string
	// only applicable for transfer credit
	TransferCredit?: TransferCredit
	transferCourseEquivalencyID?: string

	// DegreePlanCourseCreditHourClaims DegreePlanCourseCreditHourClaim[]
}

export type Degree = {
	RootBlock: Block
	blockID: string
	degreeName: string
	degreeYear: string
}