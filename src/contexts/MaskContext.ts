import { createContext } from "react"
import { MaskContextType } from "../types/degreeTest"

export const MaskContext = createContext<MaskContextType | null>(null)