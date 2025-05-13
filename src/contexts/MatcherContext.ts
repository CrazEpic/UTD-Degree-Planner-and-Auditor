import { createContext } from "react"

type MatcherContextType = {
    conditions: {} | null
    search(matcher: string): void
    close(): void
}

export const MatcherContext = createContext<MatcherContextType | null>(null)