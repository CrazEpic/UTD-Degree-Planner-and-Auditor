import { StatusCodes } from "http-status-codes"
import { Router } from "express"
import { z } from "zod"
const router = Router()

router.get("/transferCreditSchools", async (req, res) => {
	const transferSchools = await req.context.prisma.transferSchool.findMany({})
	res.json(transferSchools)
})

// table is excpected to be big, so we need to paginate results later
router.get("/transferCreditEquivalenciesByUTDCourse", async (req, res) => {
	const { data, error } = z
		.object({
			prefix: z.string().nonempty().toUpperCase(),
			number: z.string().length(4).toUpperCase(),
			schoolsFilter: z.string().optional(),
		})
		.strict()
		.safeParse(req.query)
	if (error) {
		return res.status(StatusCodes.BAD_REQUEST).send(error.errors)
	}
	const { prefix, number, schoolsFilter } = data
	// manually parse schoolsFilter as array of strings
	let parsedSchoolsFilter
	if (schoolsFilter) {
		try {
			parsedSchoolsFilter = JSON.parse("[" + schoolsFilter + "]")
			if (!Array.isArray(parsedSchoolsFilter)) {
				throw new Error("schoolsFilter is not an array")
			}
			console.log(parsedSchoolsFilter)
			parsedSchoolsFilter = parsedSchoolsFilter.map((school) => school + "")
		} catch (e) {
			return res.status(StatusCodes.BAD_REQUEST).send("schoolsFilter is not a valid array of strings")
		}
	}
	let credits

	/*
		GNED 1010
		GNED 1020
		GNED 1030
		GNED 103L
		GNED 1040
		GNED 1050
		GNED 1060
		GNED 1070
		GNED 1080
		GNED 1090
		GNED 2090
		GNED 3090
		GNED 4090
		GNED 5090
		GNED 6090
		GNED 7090
		GNED 8090
		GNED 9090
		check for core curriculum here

		also there is a weird case with MILS 180, military science leadership lab
	*/

	if (!schoolsFilter || schoolsFilter.length === 0) {
		credits = await req.context.prisma.transferCourseEquivalency.findMany({
			where: {
				OR: [
					{
						utdCourseEquivalency: {
							contains: `${prefix} ${number}`,
						},
					},
					// level match
					{
						utdCourseEquivalency: {
							contains: `${prefix} ${number[0]}---`,
						},
					},
				],
			},
		})
	} else {
		credits = await req.context.prisma.transferCourseEquivalency.findMany({
			where: {
				OR: [
					{
						utdCourseEquivalency: {
							contains: `${prefix} ${number}`,
						},
					},
					// level match
					{
						utdCourseEquivalency: {
							contains: `${prefix} ${number[0]}---`,
						},
					},
				],
				TransferSchool: {
					schoolID: {
						in: parsedSchoolsFilter,
					},
				},
			},
		})
	}
	res.json(credits)
})

router.get("/transferCreditEquivalenciesByTransferSchool", async (req, res) => {
	const { data, error } = z
		.object({
			transferSchoolSchoolID: z.string().nonempty().toUpperCase(),
		})
		.strict()
		.safeParse(req.query)
	if (error) {
		return res.status(StatusCodes.BAD_REQUEST).send(error.errors)
	}
	const { transferSchoolSchoolID } = data

	const credits = await req.context.prisma.transferCourseEquivalency.findMany({
		where: {
			transferSchoolSchoolID: transferSchoolSchoolID,
		},
	})
	res.json(credits)
})

export default router
