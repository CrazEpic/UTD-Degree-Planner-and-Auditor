import { createContext } from "react"
import { ModalContextType } from "../types/degreeTest"

export const ModalContext = createContext<ModalContextType | null>(null)