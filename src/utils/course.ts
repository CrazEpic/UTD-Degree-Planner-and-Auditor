import { Course } from "../types/degreeTest"

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