import { createContext } from "react"
import { MatcherContextType } from "../types/degreeTest"

export const MatcherContext = createContext<MatcherContextType | null>(null)