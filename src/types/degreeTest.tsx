export type Requirement = {
    id: number,
    name: string
    subReqs: Requirement[],
    subCourses: Course[],
}

export type Course = {
    id: number,
    prefix: string,
    number: string,
    name: string,
}