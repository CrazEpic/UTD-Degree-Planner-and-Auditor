import { Router } from "express"
import DegreeRouter from "./Degree/routes"
import DegreePlanRouter from "./DegreePlan/routes"
import BuildDegreeRouter from "./BuildDegree/routes"
import UserRouter from "./User/routes"
import TestAndTransferCreditsRouter from "./TestAndTransferCredits/routes"
import BuildCourseRouter from "./BuildCourse/routes"
import CourseRouter from "./Course/routes"

const router = Router()
router.use("/buildCourse", BuildCourseRouter)
router.use("/buildDegree", BuildDegreeRouter)
router.use("/course", CourseRouter)
router.use("/degree", DegreeRouter)
router.use("/degreePlan", DegreePlanRouter)
router.use("/testAndTransferCredits", TestAndTransferCreditsRouter)
router.use("/user", UserRouter)

export default router
