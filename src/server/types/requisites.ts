export type CourseLevel = "1000" | "2000" | "3000" | "4000" | "UPPER_DIVISION"

// match a list of predefined courses, or a core curriculum area, with prefix/level as optional conditions
type MatcherRequisite = {
	type: "matcher"
	matchList?: string[] | string
	condition: {
		prefix?: string
		level?: CourseLevel
		minGrade?: string
		minCreditHours?: number
	}
}

export type CourseRequisite = {
	type: "course"
	courseID: string
	minGrade?: string
}

type MajorRequisite = {
	type: "major"
	major: string
}

type MinorRequisite = {
	type: "minor"
	minor: string
}

export type CustomRequisite = {
	type: "custom"
	text: string
}

export type Requisite = MatcherRequisite | CourseRequisite | MajorRequisite | MinorRequisite | CustomRequisite

type RequisiteGroup = {
	logicalOperator: "AND" | "OR"
	requisites: RequisiteGroup[] | [Requisite]
}

export type Requisites = {
	prerequisites: RequisiteGroup
	corequisites: RequisiteGroup
	prerequisitesOrCorequisites: RequisiteGroup
}
