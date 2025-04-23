import { createContext } from "react"
import { CreditContextType } from "../types/degreeTest"

export const CreditContext = createContext<CreditContextType | null>(null)