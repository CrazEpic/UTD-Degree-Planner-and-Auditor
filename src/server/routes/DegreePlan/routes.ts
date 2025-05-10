import { StatusCodes } from "http-status-codes"
import { Router } from "express"
import { routeSchemas } from "../routeSchema"
const router = Router()

router.get("/:degreePlanID", async (req, res) => {
	const { data, error } = routeSchemas["/api/degreePlan/:degreePlanID - get"].safeParse(req.params)
	if (error) {
		return res.status(StatusCodes.BAD_REQUEST).send(error.errors)
	}
	const { degreePlanID } = data
	const degreePlan = await req.context.prisma.degreePlan.findUnique({
		where: { degreePlanID: degreePlanID },
		include: {
			DegreePlanCourses: {
				include: { Course: true },
			},
		},
	})
	res.json(degreePlan)
})

// probably change userID to be in the cookie instead
router.post("/", async (req, res) => {
	const { data, error } = routeSchemas["/api/degreePlan/ - post"].safeParse(req.body)
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
	const { data, error } = routeSchemas["/api/degreePlan/addCourse - post"].safeParse(req.body)
	if (error) {
		return res.status(StatusCodes.BAD_REQUEST).send(error.errors)
	}
	const { degreePlanID, course } = data
	const degreePlanCourse = await req.context.prisma.degreePlanCourse.create({
		data: {
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
	const { data, error } = routeSchemas["/api/degreePlan/removeCourse - delete"].safeParse(req.body)
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
	const { data, error } = routeSchemas["/api/degreePlan/updateCourseSemester - put"].safeParse(req.body)
	if (error) {
		return res.status(StatusCodes.BAD_REQUEST).send(error.errors)
	}
	const { degreePlanCourseID, semester } = data
	if (!semester) {
		const degreePlanCourse = await req.context.prisma.degreePlanCourse.update({
			where: { degreePlanCourseID: degreePlanCourseID },
			data: {
				semesterTerm: null,
				semesterYear: null,
			},
		})
		res.json(degreePlanCourse)
	} else {
		const degreePlanCourse = await req.context.prisma.degreePlanCourse.update({
			where: { degreePlanCourseID: degreePlanCourseID },
			data: {
				semesterTerm: semester.semesterTerm,
				semesterYear: semester.semesterYear,
			},
		})
		res.json(degreePlanCourse)
	}
})

router.get("/:degreePlanID/getAllCourseToRequirementBlockLinks", async (req, res) => {
	const { data, error } = routeSchemas["/api/degreePlan/:degreePlanID/getAllCourseToRequirementBlockLinks - get"].safeParse(req.params)
	if (error) {
		return res.status(StatusCodes.BAD_REQUEST).send(error.errors)
	}
	const { degreePlanID } = data
	const degreePlanCourseCreditHourClaims = await req.context.prisma.degreePlanCourseCreditHourClaim.findMany({
		where: {
			DegreePlanCourse: {
				DegreePlan: {
					degreePlanID: degreePlanID,
				},
			},
		},
		include: {
			DegreePlanCourse: true,
			Block: true,
		},
	})
	res.json(degreePlanCourseCreditHourClaims)
})

// TODO: check for terminal block
router.put("/linkCourseToRequirementBlock", async (req, res) => {
	const { data, error } = routeSchemas["/api/degreePlan/linkCourseToRequirementBlock - put"].safeParse(req.body)
	if (error) {
		return res.status(StatusCodes.BAD_REQUEST).send(error.errors)
	}
	const { degreePlanCourseID, blockID, credit } = data
	const degreePlanCourseCreditHourClaim = await req.context.prisma.degreePlanCourseCreditHourClaim.upsert({
		where: {
			degreePlanCourseCreditHourClaimID: {
				degreePlanCourseID: degreePlanCourseID,
				blockID: blockID,
			},
		},
		update: {
			credit: credit,
		},
		create: {
			credit: credit,
			DegreePlanCourse: {
				connect: { degreePlanCourseID: degreePlanCourseID },
			},
			Block: {
				connect: { blockID: blockID },
			},
		},
	})
	res.json(degreePlanCourseCreditHourClaim)
})

router.delete("/unlinkCourseFromRequirementBlock", async (req, res) => {
	const { data, error } = routeSchemas["/api/degreePlan/unlinkCourseFromRequirementBlock - delete"].safeParse(req.body)
	if (error) {
		return res.status(StatusCodes.BAD_REQUEST).send(error.errors)
	}
	const { degreePlanCourseID, blockID } = data
	const degreePlanCourseCreditHourClaim = await req.context.prisma.degreePlanCourseCreditHourClaim.delete({
		where: {
			degreePlanCourseCreditHourClaimID: {
				degreePlanCourseID: degreePlanCourseID,
				blockID: blockID,
			},
		},
	})
	res.json(degreePlanCourseCreditHourClaim)
})

router.post("/addTransferCredit", async (req, res) => {
	const { data, error } = routeSchemas["/api/degreePlan/addTransferCredit - post"].safeParse(req.body)
	if (error) {
		return res.status(StatusCodes.BAD_REQUEST).send(error.errors)
	}
	const { userID, transferCourseEquivalencyID } = data
	const transferCredit = await req.context.prisma.transferCredit.create({
		data: {
			User: {
				connect: { userID: userID },
			},
			TransferCourseEquivalency: {
				connect: { transferCourseEquivalencyID: transferCourseEquivalencyID },
			},
		},
	})
	res.json(transferCredit)
})

router.post("/applyTransferCredit", async (req, res) => {
	const { data, error } = routeSchemas["/api/degreePlan/applyTransferCredit - post"].safeParse(req.body)
	if (error) {
		return res.status(StatusCodes.BAD_REQUEST).send(error.errors)
	}
	const { userID, degreePlanID, prefix, number, transferCourseEquivalencyID } = data

	// check if given course fulfills the equivalency
	// TODO: account for other cases like GNED and LLUC from https://transfercredit.utdallas.edu/search-by-utd-course/
	const transferCourseEquivalency = await req.context.prisma.transferCourseEquivalency.findUnique({
		where: { transferCourseEquivalencyID: transferCourseEquivalencyID },
	})
	const { utdCourseEquivalency } = transferCourseEquivalency

	if (utdCourseEquivalency == "UTD 9998") {
		return res.status(StatusCodes.BAD_REQUEST).send("Not Acceptable Transfer Credit")
	}

	if (utdCourseEquivalency != `${prefix} ${number}` && utdCourseEquivalency != `${prefix} ${number[0]}---`) {
		return res.status(StatusCodes.BAD_REQUEST).send("Course does not fulfill equivalency " + utdCourseEquivalency)
	}

	const degreePlanCourse = await req.context.prisma.degreePlanCourse.create({
		data: {
			Course: {
				connect: {
					courseID: {
						prefix: prefix,
						number: number,
					},
				},
			},
			DegreePlan: {
				connect: { degreePlanID: degreePlanID },
			},
			TransferCredit: {
				connect: {
					transferCreditID: {
						userID: userID,
						transferCourseEquivalencyID: transferCourseEquivalencyID,
					},
				},
			},
		},
	})
	res.json(degreePlanCourse)
})

export default router
