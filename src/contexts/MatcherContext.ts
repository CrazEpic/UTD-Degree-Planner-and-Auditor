import { createContext } from "react"
import { MatcherContextType } from "../types/degreeTest"

// Created to pass linkCourse() from LargeWindow to PlannerCourse
export const MatcherContext = createContext<MatcherContextType | null>(null)