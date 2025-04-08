import { Router } from "express"
import DegreeRouter from "./Degree/routes"
import DegreePlanRouter from "./DegreePlan/routes"
import BuildDegreeRouter from "./BuildDegree/routes"
import UserRouter from "./User/routes"

const router = Router()

router.use("/degree", DegreeRouter)
router.use("/degreePlan", DegreePlanRouter)
router.use("/buildDegree", BuildDegreeRouter)
router.use("/user", UserRouter)

router.post("/login", async (req, res) => {
	res.send("login")
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
