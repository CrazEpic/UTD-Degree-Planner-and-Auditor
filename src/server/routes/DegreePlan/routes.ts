import { StatusCodes } from "http-status-codes"
import { Router } from "express"
import { z } from "zod"
const router = Router()

router.get("/:id", async (req, res) => {
	const { data, error } = z
		.object({
			degreePlanID: z.string(),
		})
		.strict()
		.required()
		.safeParse(req.params)
	if (error) {
		return res.status(StatusCodes.BAD_REQUEST).send(error.errors)
	}
	const { degreePlanID } = data
	const degreePlan = await req.context.prisma.degreePlan.findUnique({
		where: { degreePlanID: degreePlanID },
		include: { DegreePlanCourses: true },
	})
	res.json(degreePlan)
})

// probably change userID to be in the cookie instead
router.post("/", async (req, res) => {
	const { data, error } = z
		.object({
			userID: z.string(),
			degreeID: z.object({
				degreeName: z.string(),
				degreeYear: z.string(),
			}),
			name: z.string(),
		})
		.strict()
		.required()
		.safeParse(req.body)
	if (error) {
		return res.status(StatusCodes.BAD_REQUEST).send(error.errors)
	}
	const { userID, degreeID, name } = data
	const degreePlan = await req.context.prisma.degreePlan.create({
		data: {
			name: name,
			selectionOptions: {},
			User: {
				connect: { userID: userID },
			},
			Degree: {
				connect: {
					degreeID: {
						degreeName: degreeID.degreeName,
						degreeYear: degreeID.degreeYear,
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
			degreePlanID: z.string(),
			course: z.object({
				prefix: z.string(),
				number: z.string(),
			}),
			semester: z.object({
				semesterTerm: z.enum(["FALL", "SPRING", "SUMMER"]),
				semesterYear: z.string(),
			}),
		})
		.strict()
		.required()
		.safeParse(req.body)
	if (error) {
		return res.status(StatusCodes.BAD_REQUEST).send(error.errors)
	}
	const { degreePlanID, course, semester } = data
	const degreePlanCourse = await req.context.prisma.degreePlanCourse.create({
		data: {
			semesterTerm: semester.semesterTerm,
			semesterYear: semester.semesterYear,
			Course: {
				connect: {
					courseID: {
						prefix: course.prefix,
						number: course.number,
					},
				},
			},
			DegreePlan: {
				connect: { degreePlanID: degreePlanID },
			},
		},
	})
	res.json(degreePlanCourse)
})

router.delete("/removeCourse", async (req, res) => {
	const { data, error } = z
		.object({
			degreePlanCourseID: z.string(),
		})
		.strict()
		.required()
		.safeParse(req.body)
	if (error) {
		return res.status(StatusCodes.BAD_REQUEST).send(error.errors)
	}
	const { degreePlanCourseID } = data
	const degreePlanCourse = await req.context.prisma.degreePlanCourse.delete({
		where: { degreePlanCourseID: degreePlanCourseID },
	})
	res.json(degreePlanCourse)
})

router.put("/updateCourseSemester", async (req, res) => {
	const { data, error } = z
		.object({
			degreePlanCourseID: z.string(),
			semester: z.object({
				semesterTerm: z.enum(["FALL", "SPRING", "SUMMER"]),
				semesterYear: z.string(),
			}),
		})
		.strict()
		.required()
		.safeParse(req.body)
	if (error) {
		return res.status(StatusCodes.BAD_REQUEST).send(error.errors)
	}
	const { degreePlanCourseID, semester } = data
	const degreePlanCourse = await req.context.prisma.degreePlanCourse.update({
		where: { degreePlanCourseID: degreePlanCourseID },
		data: {
			semesterTerm: semester.semesterTerm,
			semesterYear: semester.semesterYear,
		},
	})
	res.json(degreePlanCourse)
})

export default router
