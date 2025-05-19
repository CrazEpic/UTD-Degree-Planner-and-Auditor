import { createContext } from "react"
import { User } from "../types/degree"

type UserContextType = {
    user: User | null
    fetchUser(): void
}

export const UserContext = createContext<UserContextType | null>(null)