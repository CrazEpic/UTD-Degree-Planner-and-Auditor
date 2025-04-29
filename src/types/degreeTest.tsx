export type Course = {
    id: string,
    prefix: string,
    number: string,
    name: string,
}

export enum SemesterTerm {
    FALL = 0,
    SPRING = 1,
    SUMMER = 2,
}

export type User = {
    userID: string,
    username: string
    TestCredits: TestCredit[],
    TransferCredits: TransferCredit[],
    DegreePlan?: DegreePlan,
}

export type UserContextType = {
    user: User | null,
    fetchUser(): void,
}

export type CoursesContextType = {
    courses: Course[],
    fetchCourses(): void,
}

export type ModalContextType = {
    linkCourse?(c: Course): void,
    findCredit?(type: string): void,
}

export type MatcherContextType = {
    conditions: {} | null,
    search(matcher: string): void,
    close(): void,
}

export type Transfer = {
    school: string,
    course: string,
}

export type Test = {
    type: string,
    name: string,
}

export type TestCredit = {
    User: User,
    TestEquivalency: TestEquivalency,
    DegreePlanCourse: DegreePlanCourse[],
}

export type TestEquivalency = {
    testComponentID: string,
    courseEquivalency: JSON,
    maxClaimableCreditHours: number,
    TestCredit: TestCredit[],
}

export type TransferCredit = {
    User: User,
    TransferCourseEquivalency: TransferCourseEquivalency,
    DegreePlanCourse: DegreePlanCourse[],
}

export type TransferCourseEquivalency = {
    externalSchool: string,
    externalCourseID: string,
    courseEquivalency: JSON,
    TransferCredit: TransferCredit[],
}


export type DegreePlan = {
    degreePlanID:      string,      
    startSemesterTerm: SemesterTerm,
    startSemesterYear: string,      
    endSemesterTerm:   SemesterTerm,
    endSemesterYear:   string,      
    userID:            string,      
    // User:              User,        
    name:              string,      
    Degree:            Degree,      
    degreeName:        string,      
    degreeYear:        string,      
    DegreePlanCourses: DegreePlanCourse[],
    // selectionOptions:  Json,       

}

export type DegreePlanCourse = {
    degreePlanCourseID: string,       
    degreePlanID: string,    
    DegreePlan: DegreePlan,   
    Course: Course,       
    prefix: string,        
    number: string,        
    // only applicable for courses at
    semesterYear?: string,      
    semesterTerm?: SemesterTerm, 
    // both test and transfer uses us
    userID?: string,       
    // only applicable for test credit    
    TestCredit?: TestCredit   
    testComponentID?: string,       
    // only applicable for transfer credit
    TransferCredit?: TransferCredit
    externalSchool?: string,       
    externalCourseID?: string,       

    // DegreePlanCourseCreditHourClaims DegreePlanCourseCreditHourClaim[]
}

export type Degree = {
    RootBlock: Block,
    blockID: string,
    degreeName: string,
    degreeYear: string,
}
  
export type NonTerminalBlock = {
    id: string,
    conditions: object,
}

// Update b/c why does this not have a course name attached
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
    blockID: string,
    blockName: string,
    parentBlockID: string,
    blockPosition: number,
    innerBlocks: Block[],
    blockType: string,
    blockContent: NonTerminalBlock | CourseBlock | TextBlock | MatcherGroupBlock | FlagToggleBlock,
}

