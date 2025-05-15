import { Course, DegreePlanCourse } from "../types/degree"

export const courseSearchSort = (courseA: Course, courseB: Course, query: string) => {
    let input = query.toLowerCase().trimEnd()

    if (input.length === 0) {
        return courseA.prefix.localeCompare(courseB.prefix)
    }

    let aIndex = courseA.prefix.toLowerCase().indexOf(input)
    let bIndex = courseB.prefix.toLowerCase().indexOf(input)

    if (aIndex !== bIndex || courseA.prefix !== courseB.prefix) {
        if (aIndex === -1) return 1
        if (bIndex === -1) return -1
        return aIndex - bIndex
    }
    
    if (input.includes(courseA.prefix)) {
        input = input.slice(courseA.prefix.length)
    }

    if (courseA.number !== courseB.number) {
        return courseA.number.localeCompare(courseB.number)
    }

    aIndex = courseA.number.toLowerCase().indexOf(input)
    bIndex = courseB.number.toLowerCase().indexOf(input)

    if (aIndex === -1) return 1
    if (bIndex === -1) return -1

    return bIndex - aIndex
}

// Can be updated as more tags are added
export const getTagInformation = (course: DegreePlanCourse) => {
    let tags : string[] = []

    if (course.testComponentID) {
        // Split based on test type (AP / CLEP / IB / A Level)
        // There should be a better way than course.TestCredit.TestEquivalency.testType
        tags = [...tags, course.TestCredit?.TestEquivalency?.testType as string]
    }

    if (course.transferCourseEquivalencyID) {
        tags = [...tags, "T"]
    }

    return tags
}