export type Course = {
    prefix: string,
    number: string,
    name: string,
    flag: string
}

export type Degree = {
    RootBlock: Block,
    blockId: string,
    degreeName: string,
    degreeYear: string,
}
  
export type NonTerminalBlock = {
    id: string,
    conditions: {},
}

export type CourseBlock = {
    id: string,
    number: string,
    prefix: string,
}

export type TextBlock = {
    id: string,
    text: string,
}

export type MatcherGroupBlock = {
    id: string,
    matcher: string, // JSON?
}

export type FlagToggleBlock = {
    id: string,
    flag: DegreeFlag,
    flagId: string,
}

export type DegreeFlag = {
    id: string
    flag: string,
    toggles: FlagToggleBlock[],
}
  
export type Block = {
    blockId: string,
    blockName: string,
    parentBlockId: string,
    blockPosition: number,
    innerBlocks: Block[],
    blockType: string,
    blockContent: NonTerminalBlock | CourseBlock | TextBlock | MatcherGroupBlock | FlagToggleBlock,
}