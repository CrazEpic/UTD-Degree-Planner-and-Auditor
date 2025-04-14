import { createContext } from "react"
import { UserContextType } from "../types/degreeTest"

// export const UserContext = createContext(null)
export const UserContext = createContext<UserContextType | null>(null)