import { transferCredit, transferSchool } from "../types/testAndTransferTypes"

export const createDefaultTransferSchool = () : transferSchool => {
    return {
        schoolID: "",
        schoolName: "",
        schoolCity: "",
        schoolState: "",
        schoolCountry: "",
    }
}

export const createDefaultTransferCredit = () : transferCredit => {
    return {
        transferCourseEquivalencyID: "",
        transferCourseID: "",
        transferCourseName: "",
        utdCourseEquivalency: "",
        utdCourseEquivalencyName: "",
        transferSchoolSchoolID: "",
    }
}

export const createDefaultTestEquivalency = () => {
    return {
        testComponentID: "",
        testType: "",
        examName: "",
        minScore: "",
        maxScore: "",
        maxClaimableCreditHours: 0,
        utdEquivalencyCourses: "",
        TestCredit: [],
    }
}