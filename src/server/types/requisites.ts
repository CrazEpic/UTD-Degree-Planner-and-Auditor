export type CourseLevel = "1000" | "2000" | "3000" | "4000" | "UPPER_DIVISION"

// match a list of predefined courses, or a core curriculum area, with prefix/level as optional conditions
type MatcherRequisite = {
	type: "matcher"
	match: string[] | string
	condition: {
		prefix?: string
		level?: CourseLevel
		min_grade?: string
		min_credit_hours?: number
	}
}

type CourseRequisite = {
	type: "course"
	course_id: string
	min_grade?: string
}

type MajorRequisite = {
	type: "major"
	major: string
}

type MinorRequisite = {
	type: "minor"
	minor: string
}

type HourStandingRequisite = {
	type: "hour_standing"
	hours: "FRESHMAN" | "SOPHOMORE" | "JUNIOR" | "SENIOR"
}

type CustomRequisite = {
	type: "custom"
	text: string
}

type Requisite = MatcherRequisite | CourseRequisite | MajorRequisite | MinorRequisite | HourStandingRequisite | CustomRequisite

type RequisiteGroup = {
	logicalOperator: "AND" | "OR"
	requisites: RequisiteGroup[] | Requisite
}

export type Requisites = {
	prequisites: RequisiteGroup
	corequisites: RequisiteGroup
	prerequires_or_corequisites: RequisiteGroup
}
