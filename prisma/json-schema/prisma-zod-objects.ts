
import { z } from "zod"
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi"
extendZodWithOpenApi(z)

export const prismaZodSchemas = {
"TestEquivalency": z.object({ "testComponentID": z.string().optional(), "testType": z.string().optional(), "examName": z.string().optional(), "minScore": z.number().int().optional(), "maxScore": z.number().int().optional(), "maxClaimableHours": z.number().int().optional(), "utdEquivalencyCourses": z.string().optional() }),
"TransferSchool": z.object({ "schoolID": z.string().optional(), "schoolName": z.string().optional(), "schoolCity": z.string().optional(), "schoolState": z.string().optional(), "schoolCountry": z.string().optional() }),
"TransferCourseEquivalency": z.object({ "transferCourseEquivalencyID": z.string().optional(), "transferCourseID": z.string().optional(), "transferCourseName": z.string().optional(), "utdCourseEquivalency": z.string().optional(), "utdCourseEquivalencyName": z.string().optional(), "transferSchoolSchoolID": z.string().optional() }),
"Course": z.object({ "prefix": z.string().optional(), "number": z.string().optional(), "name": z.string().optional(), "coreCurriculumAreaName": z.union([z.string(), z.null()]).optional(), "requisites": z.object({}).optional() }),
"CoreCurriculumArea": z.object({ "coreCurriculumAreaName": z.string().optional() }),
"Degree": z.object({ "degreeName": z.string().optional(), "degreeYear": z.string().optional(), "blockID": z.string().optional() }),
"BlockRequirement": z.object({ "blockID": z.string().optional(), "blockName": z.string().optional(), "parentBlockID": z.union([z.string(), z.null()]).optional(), "blockPosition": z.number().int().default(1) }),
"NonterminalBlock": z.object({ "id": z.string().optional(), "conditions": z.object({}).optional() }),
"CourseBlock": z.object({ "id": z.string().optional(), "prefix": z.string().optional(), "number": z.string().optional() }),
"TextBlock": z.object({ "id": z.string().optional(), "text": z.string().default("") }),
"MatcherGroupBlock": z.object({ "id": z.string().optional(), "matcher": z.object({}).optional() }),
"FlagToggleBlock": z.object({ "id": z.string().optional(), "flag_id": z.string().optional() }),
"DegreeFlag": z.object({ "id": z.string().optional(), "flag": z.string().optional() }),
"User": z.object({ "userID": z.string().optional(), "username": z.string().optional() }),
"TestCredit": z.object({ "testComponentID": z.string().optional(), "userID": z.string().optional() }),
"TransferCredit": z.object({ "userID": z.string().optional(), "transferCourseEquivalencyID": z.string().optional() }),
"DegreePlan": z.object({ "degreePlanID": z.string().optional(), "startSemesterTerm": z.enum(["FALL","SPRING","SUMMER"]).optional(), "startSemesterYear": z.string().optional(), "endSemesterTerm": z.enum(["FALL","SPRING","SUMMER"]).optional(), "endSemesterYear": z.string().optional(), "userID": z.string().optional(), "name": z.string().optional(), "degreeName": z.string().optional(), "degreeYear": z.string().optional(), "selectionOptions": z.object({}).optional() }),
"DegreePlanCourse": z.object({ "degreePlanCourseID": z.string().optional(), "degreePlanID": z.string().optional(), "prefix": z.string().optional(), "number": z.string().optional(), "semesterYear": z.union([z.string(), z.null()]).optional(), "semesterTerm": z.union([z.string(), z.null()]).optional(), "userID": z.union([z.string(), z.null()]).optional(), "testComponentID": z.union([z.string(), z.null()]).optional(), "transferCourseEquivalencyID": z.union([z.string(), z.null()]).optional() }),
"DegreePlanCourseCreditHourClaim": z.object({ "blockID": z.string().optional(), "degreePlanCourseID": z.string().optional(), "credit": z.number().int().optional() }),
}
