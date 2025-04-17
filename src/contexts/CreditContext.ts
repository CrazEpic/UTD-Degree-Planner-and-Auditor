import { createContext } from "react"
import { CreditContextType } from "../types/degreeTest"

// Created to pass linkCourse() from LargeWindow to PlannerCourse
export const CreditContext = createContext<CreditContextType | null>(null)