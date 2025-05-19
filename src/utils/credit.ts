import { Course } from "../types/degree"

// TODO: Parse the equivalency information
export const getEquivalentCourses = (courses: Course[], equivalency: string) : Course[] => {
    let equivalentCourses = new Set<Course>()

    // If there are multiple conditions, evaluate each separately
    let conditions = [equivalency]
    if (equivalency.includes(",")) {
        conditions = equivalency.split(",")
    }
    
    
    let courseID
    courses.forEach((course) => {
        conditions.forEach((condition) => {
            courseID = course.prefix + " " + course.number
            
            // ID Check
            if (courseID === condition) {
                equivalentCourses.add(course)
            }

            // PRE X--- Check (need to check if the condtion contains ---)
            if (condition.endsWith("---") && courseID.startsWith(condition.slice(0, -3))) {
                equivalentCourses.add(course)
            }
        })
    })

    return Array.from(equivalentCourses)
}