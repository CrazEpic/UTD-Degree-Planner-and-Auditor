import { StatusCodes } from "http-status-codes"
import { Router } from "express"
import { z } from "zod"
const router = Router()

router.get("/:id", async (req, res) => {
	const { data, error } = z
		.object({
			id: z.string(),
		})
		.strict()
		.required()
		.safeParse(req.params)
	if (error) {
		return res.status(StatusCodes.BAD_REQUEST).send(error.errors)
	}
	const { id } = data
	const degreePlan = await req.context.prisma.degreePlan.findUnique({
		where: { id: id },
		include: { DegreePlanCourses: true },
	})
	res.json(degreePlan)
})

// probably change user_id to be in the cookie instead
router.post("/", async (req, res) => {
	const { data, error } = z
		.object({
			user_id: z.string(),
			degree_id: z.object({
				degree_name: z.string(),
				degree_year: z.string(),
			}),
			name: z.string(),
		})
		.strict()
		.required()
		.safeParse(req.body)
	if (error) {
		return res.status(StatusCodes.BAD_REQUEST).send(error.errors)
	}
	const { user_id, degree_id, name } = data
	const degreePlan = await req.context.prisma.degreePlan.create({
		data: {
			name: name,
			selection_options: {},
			User: {
				connect: { user_id: user_id },
			},
			Degree: {
				connect: {
					degree_id: {
						degree_name: degree_id.degree_name,
						degree_year: degree_id.degree_year,
					},
				},
			},
		},
	})
	res.json(degreePlan)
})

// TODO: handle test and transfer credits
router.post("/addCourse", async (req, res) => {
	const { data, error } = z
		.object({
			degree_plan_id: z.string(),
			course: z.object({
				prefix: z.string(),
				number: z.string(),
			}),
			semester: z.object({
				semester_term: z.enum(["FALL", "SPRING", "SUMMER"]),
				semester_year: z.string(),
			}),
		})
		.strict()
		.required()
		.safeParse(req.body)
	if (error) {
		return res.status(StatusCodes.BAD_REQUEST).send(error.errors)
	}
	const { degree_plan_id, course, semester } = data
	const degreePlanCourse = await req.context.prisma.degreePlanCourse.create({
		data: {
			semester_term: semester.semester_term,
			semester_year: semester.semester_year,
			Course: {
				connect: {
					course_id: {
						prefix: course.prefix,
						number: course.number,
					},
				},
			},
			DegreePlan: {
				connect: { id: degree_plan_id },
			},
		},
	})
	res.json(degreePlanCourse)
})

router.delete("/removeCourse", async (req, res) => {
	const { data, error } = z
		.object({
			id: z.string(),
		})
		.strict()
		.required()
		.safeParse(req.body)
	if (error) {
		return res.status(StatusCodes.BAD_REQUEST).send(error.errors)
	}
	const { id } = data
	try {
		const degreePlanCourse = await req.context.prisma.degreePlanCourse.delete({
			where: { id: id },
		})
		res.json(degreePlanCourse)
	} catch (error) {
		console.log(error)
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error removing class")
	}
})

router.put("/updateCourseSemester", async (req, res) => {
	const { data, error } = z
		.object({
			id: z.string(),
			semester: z.object({
				semester_term: z.enum(["FALL", "SPRING", "SUMMER"]),
				semester_year: z.string(),
			}),
		})
		.strict()
		.required()
		.safeParse(req.body)
	if (error) {
		return res.status(StatusCodes.BAD_REQUEST).send(error.errors)
	}
	const { id, semester } = data
	const degreePlanCourse = await req.context.prisma.degreePlanCourse.update({
		where: { id: id },
		data: {
			semester_term: semester.semester_term,
			semester_year: semester.semester_year,
		},
	})
	res.json(degreePlanCourse)
})

export default router
