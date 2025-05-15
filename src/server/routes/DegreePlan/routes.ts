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
				include: { Course: true, TransferCredit: true, TestCredit: true },
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
	// TODO: account for semester start and (end?)
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

	if (!transferCourseEquivalency) {
		return res.status(StatusCodes.BAD_REQUEST).send("Transfer Course Equivalency not found")
	}

	const { utdCourseEquivalency } = transferCourseEquivalency

	if (utdCourseEquivalency == "UTD 9998") {
		return res.status(StatusCodes.BAD_REQUEST).send("Not Acceptable Transfer Credit")
	}

	if (utdCourseEquivalency != `${prefix} ${number}` && utdCourseEquivalency != `${prefix} ${number[0]}---`) {
		return res.status(StatusCodes.BAD_REQUEST).send("Course does not fulfill equivalency " + utdCourseEquivalency)
	}

	// don't double dip even if the course is another transfer, test, planned, or already taken
	const foundDegreePlanCourse = await req.context.prisma.degreePlanCourse.findFirst({
		where: {
			DegreePlan: {
				degreePlanID: degreePlanID,
			},
			Course: {
				prefix: prefix,
				number: number,
			},
		},
	})

	if (foundDegreePlanCourse) {
		return res.status(StatusCodes.BAD_REQUEST).send("Course already in planner")
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

router.post("/addTestCredit", async (req, res) => {
	const { data, error } = routeSchemas["/api/degreePlan/addTestCredit - post"].safeParse(req.body)
	if (error) {
		return res.status(StatusCodes.BAD_REQUEST).send(error.errors)
	}
	const { userID, testComponentID, testScore } = data

	// check if test score is valid
	const testEquivalency = await req.context.prisma.testEquivalency.findUnique({
		where: { testComponentID: testComponentID },
	})
	if (!testEquivalency) {
		return res.status(StatusCodes.BAD_REQUEST).send("Test Equivalency not found")
	}
	const { minScore } = testEquivalency
	if (testScore < minScore) {
		return res.status(StatusCodes.BAD_REQUEST).send("Test score is too low")
	}

	// check if the course is already in the degree plan
	const foundDegreePlanCourse = await req.context.prisma.degreePlanCourse.findFirst({
		where: {
			DegreePlan: {
				User: {
					userID: userID,
				},
			},
			TestCredit: {
				testComponentID: testComponentID,
			},
		},
	})
	if (foundDegreePlanCourse) {
		return res.status(StatusCodes.BAD_REQUEST).send("Course already in planner")
	}

	const testCredit = await req.context.prisma.testCredit.create({
		data: {
			testScore: testScore,
			User: {
				connect: { userID: userID },
			},
			TestEquivalency: {
				connect: { testComponentID: testComponentID },
			},
		},
	})
	res.json(testCredit)
})

router.post("/applyTestCredit", async (req, res) => {
	const { data, error } = routeSchemas["/api/degreePlan/applyTestCredit - post"].safeParse(req.body)
	if (error) {
		return res.status(StatusCodes.BAD_REQUEST).send(error.errors)
	}
	const { userID, degreePlanID, prefix, number, testComponentID } = data
	const testEquivalency = await req.context.prisma.testEquivalency.findUnique({
		where: { testComponentID: testComponentID },
	})

	if (!testEquivalency) {
		return res.status(StatusCodes.BAD_REQUEST).send("Test Equivalency not found")
	}

	const { utdEquivalencyCourses } = testEquivalency

	const courseID = `${prefix} ${number}`

	// check if the course is in the equivalency
	const utdEquivalencyCoursesArray = utdEquivalencyCourses.split(", ")

	const validEquivalencies = utdEquivalencyCoursesArray.filter((course) => {
		// check if the course is in the equivalency
		return course === courseID || (course.includes("---") && `${prefix} ${number[0]}---` == course)
	})

	if (validEquivalencies.length == 0) {
		return res.status(StatusCodes.BAD_REQUEST).send("Course not in equivalency")
	}

	// want to make sure you don't count a credit more than you can
	// and don't claim more than maxClaimableHours
	const appliedTestCredits = await req.context.prisma.testCredit.findMany({
		where: {
			userID: userID,
			testComponentID: testComponentID,
		},
		include: {
			DegreePlanCourse: true,
		},
	})

	const doubleDipping = appliedTestCredits.some((appliedTestCredit) => {
		return `${appliedTestCredit.DegreePlanCourse.prefix} ${appliedTestCredit.DegreePlanCourse.number}` === courseID
	})

	if (doubleDipping) {
		return res.status(StatusCodes.BAD_REQUEST).send("Course already claimed")
	}

	const claimedCreditHours = appliedTestCredits.reduce((acc, testCredit) => {
		// credit hours is the second digit
		return acc + parseInt(testCredit.DegreePlanCourse.number[1])
	}, 0)

	if (claimedCreditHours + parseInt(number[1]) >= testEquivalency.maxClaimableHours) {
		return res.status(StatusCodes.BAD_REQUEST).send("Adding this test credit will exceed max claimable hours")
	}

	// check if the course is already in the degree plan
	const foundDegreePlanCourse = await req.context.prisma.degreePlanCourse.findFirst({
		where: {
			DegreePlan: {
				degreePlanID: degreePlanID,
			},
			Course: {
				prefix: prefix,
				number: number,
			},
		},
	})

	if (foundDegreePlanCourse) {
		return res.status(StatusCodes.BAD_REQUEST).send("Course already in planner")
	}

	const testCredit = await req.context.prisma.degreePlanCourse.create({
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
			TestCredit: {
				connect: {
					testCreditID: {
						userID: userID,
						testComponentID: testComponentID,
					},
				},
			},
		},
	})
	res.json(testCredit)
})

export default router
