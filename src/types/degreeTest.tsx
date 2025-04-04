export type Requirement = {
    id: number,
    name: string
    matcher: boolean,
    subReqs: Requirement[],
    subCourses: Course[],
    condition: string,
}

export type Course = {
    id: number,
    prefix: string,
    number: string,
    name: string,
}

export type Degree = {
    RootBlock: Block,
    block_id: string,
    degree_name: string,
    degree_year: string,
}
  
export type NonTerminalBlock = {
    id: string,
    type: "NonTerminal",
    conditions: {},

}

export type CourseBlock = {
    id: string,
    type: "Course"
    number: string,
    prefix: string,
}
  
export type Block = {
      block_id: string,
      block_name: string,
      parent_block_id: string,
      block_position: number,
      inner_blocks: Block[],
      NonTerminalBlock?: NonTerminalBlock,
      CourseBlock?: CourseBlock,
      blockType: NonTerminalBlock | CourseBlock,
}