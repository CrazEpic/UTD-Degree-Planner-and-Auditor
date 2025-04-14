import { createContext } from "react"
import { LinkContextType } from "../types/degreeTest"

// Created to pass linkCourse() from LargeWindow to PlannerCourse
export const LinkContext = createContext<LinkContextType | null>(null)