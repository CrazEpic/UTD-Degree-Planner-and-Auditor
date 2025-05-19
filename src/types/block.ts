import { Course, Degree } from "./degree"

export type NonTerminalBlock = {
	id: string
	conditions: object
}

// TODO: Simplify this type (preferably remove Course)
// Block is not currently being parsed
export type CourseBlock = {
	id: string
	Block: BlockRequirement
	Course: Course
	prefix: string
	number: string
}

export type TextBlock = {
	id: string
	text: string
}

export type MatcherGroupBlock = {
	id: string
	matcher: string // JSON?
}

export type FlagToggleBlock = {
	id: string
	flag: DegreeFlag
	flagId: string
}

export type DegreeFlag = {
	id: string
	flag: string
	toggles: FlagToggleBlock[]
}

export type Block = {
	blockID: string
	blockName: string
	parentBlockID: string
	blockPosition: number
	innerBlocks: Block[]
	blockType: string
	blockContent: NonTerminalBlock | CourseBlock | TextBlock | MatcherGroupBlock | FlagToggleBlock
}

export type BlockRequirement = {
	blockID: string
	blockName: string
	parentBlockID?: string
	ParentBlock?: BlockRequirement
	InnerBlocks: BlockRequirement[]

	// TODO: use lexoranking for ordering
	blockPosition: number

	// PLEASE ONLY USE ONE AND ONLY ONE OF THE BLOCKS BELOW
	NonterminalBlock?: NonTerminalBlock
	CourseBlock?: CourseBlock
	TextBlock?: TextBlock
	MatcherGroupBlock?: MatcherGroupBlock
	FlagToggleBlock?: FlagToggleBlock

	// should only be true for the root block
	Degree?: Degree

	// DegreePlanCourseCreditHourClaims DegreePlanCourseCreditHourClaim[]
}