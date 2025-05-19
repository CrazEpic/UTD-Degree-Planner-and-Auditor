import { createContext } from "react"
import { Course } from "../types/degree"

type CoursesContextType = {
    courses: Course[]
    fetchCourses(): void
}

export const CoursesContext = createContext<CoursesContextType | null>(null)
