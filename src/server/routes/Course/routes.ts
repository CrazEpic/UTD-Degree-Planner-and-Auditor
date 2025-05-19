import { Router } from "express"
import { StatusCodes } from "http-status-codes"
import { routeSchemas } from "../routeSchema"
const router = Router()

router.get("/courses", async (req, res) => {
	const course = await req.context.prisma.course.findMany({})
	res.json(course)
})

router.get("/course", async (req, res) => {
	const { data, error } = routeSchemas["/api/course/course - get"].safeParse(req.query)
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

export default router
