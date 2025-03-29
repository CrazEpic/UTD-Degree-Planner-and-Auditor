export type Req = {
    id: number,
    name: string
    subReqs: Req[],
    subCourses: Course[],
}

export type Course = {
    id: number,
    prefix: string,
    number: string,
    name: string,
}