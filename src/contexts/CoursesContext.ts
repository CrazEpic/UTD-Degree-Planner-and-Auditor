import { createContext } from "react"
import { CoursesContextType } from "../types/degreeTest"

export const CoursesContext = createContext<CoursesContextType | null>(null)
