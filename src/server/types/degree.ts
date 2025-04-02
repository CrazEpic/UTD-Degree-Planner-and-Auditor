import { CourseLevel } from "./requisites"

type Condition = BlockFulfillmentCondition | BlockInclusionCondition | CreditHourCondition | LevelCondition | HourBeyondBlockCondition

type BlockFulfillmentCondition = {
	minBlocksToFulfill: number
}

type BlockInclusionCondition = {
	minBlocksToInclude: number
}

type CreditHourCondition = {
	minCreditHours: number
}

type LevelCondition = {
	creditHourRequirement: number
	level: CourseLevel
}

type HourBeyondBlockCondition = {
	blockKey: string
	hoursBeyondBlock: number
}

export type DegreeConditions = {
	conditions: Condition[]
}

// separate from just course list because this is global across years
type MatchCoreCurriculumArea = {
	area: string
}

type MatchCourseList = {
	courses: string[]
}

type MatchCourseProperty = {
	prefix: string
	level: CourseLevel
}

type Matcher = MatchCoreCurriculumArea | MatchCourseList | MatchCourseProperty

// include is union, exclude is union, then include - exclude
// no need to build a whole parse tree I think
export type MatcherGroupBlock = {
	matcher: {
		include: Matcher[]
		exclude: Matcher[]
	}
}
