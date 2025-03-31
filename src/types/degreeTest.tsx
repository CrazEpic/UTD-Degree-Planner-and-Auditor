export type Requirement = {
    id: number,
    name: string
    matcher: boolean,
    subReqs: Requirement[],
    subCourses: Course[],
}

export type Course = {
    id: number,
    prefix: string,
    number: string,
    name: string,
}