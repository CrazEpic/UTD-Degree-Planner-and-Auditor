import { Router } from "express"
import { StatusCodes } from "http-status-codes"
import { routeSchemas } from "../routeSchema"
const router = Router()

router.post("/course", async (req, res) => {
	const { data, error } = routeSchemas["/api/buildCourse/course - post"].safeParse(req.body)
	if (error) {
		return res.status(StatusCodes.BAD_REQUEST).send(error.errors)
	}
	const { prefix, number, name } = data
	const course = await req.context.prisma.course.create({
		data: {
			prefix: prefix,
			number: number,
			name: name,
			requisites: {
				prerequisites: {},
				corequisites: {},
				prerequisitesOrCorequisites: {},
			},
		},
	})
	res.json(course)
})

router.put("/course", async (req, res) => {
	const { data, error } = routeSchemas["/api/buildCourse/course - put"].safeParse(req.body)
	if (error) {
		return res.status(StatusCodes.BAD_REQUEST).send(error.errors)
	}
	const { prefix, number, name, requisites } = data
	const course = await req.context.prisma.course.update({
		where: {
			courseID: {
				prefix: prefix,
				number: number,
			},
		},
		data: {
			name: name,
			requisites: requisites,
		},
	})
	res.json(course)
})

export default router
