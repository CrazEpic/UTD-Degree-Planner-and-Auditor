import { Course } from "../types/degree"
import { createContext } from "react"

type ModalContextType = {
    linkCourse?(c: Course): void
    findCredit?(type: string): void
}

export const ModalContext = createContext<ModalContextType | null>(null)