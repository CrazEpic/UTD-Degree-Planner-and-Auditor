import { createContext } from "react"
import { LinkContextType } from "../types/degreeTest"

export const LinkContext = createContext<LinkContextType | null>(null)