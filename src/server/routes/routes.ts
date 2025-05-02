import { Router } from "express"
import DegreeRouter from "./Degree/routes"
import DegreePlanRouter from "./DegreePlan/routes"
import BuildDegreeRouter from "./BuildDegree/routes"
import UserRouter from "./User/routes"
import TestAndTransferCreditsRouter from "./TestAndTransferCredits/routes"

const router = Router()

router.use("/degree", DegreeRouter)
router.use("/degreePlan", DegreePlanRouter)
router.use("/buildDegree", BuildDegreeRouter)
router.use("/user", UserRouter)
router.use("/testAndTransferCredits", TestAndTransferCreditsRouter)

router.post("/login", async (req, res) => {
	res.send("login")
})

import { z } from "zod"
import { StatusCodes } from "http-status-codes"

router.get("/courses", async (req, res) => {
	const course = await req.context.prisma.course.findMany({})
	res.json(course)
})

router.get("/course", async (req, res) => {
	const { data, error } = z
		.object({
			prefix: z.string(),
			number: z.string(),
		})
		.strict()
		.required()
		.safeParse(req.query)
	if (error) {
		return res.status(StatusCodes.BAD_REQUEST).send(error.errors)
	}
	const { prefix, number } = data
	const course = await req.context.prisma.course.findUnique({
		where: {
			courseID: {
				prefix: prefix,
				number: number,
			},
		},
	})
	res.json(course)
})

// General database stuff

/*
Courses
	update prereqs as well
Test/Transfer Equivalencies

*/
// Login + Authentication
// Planner
//     Switch between planner and graph
//     Move Course (if moved onto a semester, it is locked), Remove Course, Link Course to Requirement, and Unlink
//     Locking hours for a semester
//     Given list of courses, show transferable credit
//         Also do this for requirements tab
// Prereq Tab -
//     Fetch the prereq
//     Handle user prereq selection/options
// Requirements Tab
//     Fetch the degree
//     Put course onto planner
//     Selecting an optional block
//     Unselecting an optional block
//     Maybe an API call to handle select and unselect another block
//     Matcher - API call for the specific matcher to return list of relevant courses
//     Flag Toggle - on and off
//     Search
//         Timer on key stop (dot dot dot API call)
// Building
//     Progress bar option on and off (THINK MORE ABOUT IT)
// Flowchart
// Test Credits
// Transfer Credits

export default router
