import { PrismaClient } from "@prisma/client"
import { Requisites } from "../src/server/types/requisites"
import { DegreeConditions } from "../src/server/types/degree"

const prisma = new PrismaClient()

const createCoreCurriculumAreas = async () => {
	const areas = [
		"Communication",
		"Mathematics",
		"Life and Physical Sciences",
		"Language, Philosophy and Culture",
		"Creative Arts",
		"American History",
		"Government/Political Science",
		"Social and Behavioral Sciences",
		"Component Area Option",
	]
	await prisma.coreCurriculumArea.createMany({
		data: areas.map((area) => ({
			coreCurriculumAreaName: area,
		})),
	})
}

const createCourses = async () => {
	const emptyRequisites: Requisites = {
		prequisites: { logicalOperator: "AND", requisites: [] },
		corequisites: { logicalOperator: "AND", requisites: [] },
		prerequiresOrCorequisites: { logicalOperator: "AND", requisites: [] },
	}

	await prisma.course.create({
		data: {
			prefix: "MATH",
			number: "2413",
			name: "Differential Calculus",
			coreCurriculumAreaName: "Mathematics",
			requisites: emptyRequisites,
		},
	})

	await prisma.course.create({
		data: {
			prefix: "CS",
			number: "1436",
			name: "Programming Fundamentals",
			requisites: emptyRequisites,
		},
	})
}

const createCSDegree = async () => {
	const emptyConditions: DegreeConditions = {}

	await prisma.degree.create({
		data: {
			degreeName: "Computer Science",
			degreeYear: "2025",
			RootBlock: {
				create: {
					blockName: "Bachelor of Science in Computer Science (2025)",
					NonterminalBlock: {
						create: { conditions: emptyConditions },
					},
					InnerBlocks: {
						create: [
							{
								blockName: "I. Core Curriculum",
								blockPosition: 1,
								NonterminalBlock: { create: { conditions: emptyConditions } },
								InnerBlocks: {
									create: [
										{
											blockName: "Mathematics",
											NonterminalBlock: { create: { conditions: emptyConditions } },
											InnerBlocks: {
												create: [
													{
														blockName: "Differential Calculus",
														CourseBlock: {
															create: {
																prefix: "MATH",
																number: "2413",
															},
														},
													},
												],
											},
										},
									],
								},
							},
							{
								blockName: "II. Major Requirements",
								blockPosition: 2,
								NonterminalBlock: { create: { conditions: emptyConditions } },
							},
						],
					},
				},
			},
		},
	})
}

const createUsers = async () => {
	await prisma.user.create({
		data: {
			username: "craz",
		},
	})
}

const createCrazDegreePlan = async () => {
	const craz = await prisma.user.findFirst({
		where: { username: "craz" },
	})

	const degreePlan = await prisma.degreePlan.create({
		data: {
			name: "Craz's Degree Plan",
			startSemesterTerm: "FALL",
			startSemesterYear: "2022",
			endSemesterTerm: "SPRING",
			endSemesterYear: "2026",
			selectionOptions: {},
			User: {
				connect: { userID: craz.userID },
			},
			Degree: {
				connect: {
					degreeID: {
						degreeName: "Computer Science",
						degreeYear: "2025",
					},
				},
			},
		},
	})

	await prisma.degreePlanCourse.create({
		data: {
			semesterTerm: "FALL",
			semesterYear: "2022",
			DegreePlan: {
				connect: { degreePlanID: degreePlan.degreePlanID },
			},
			Course: {
				connect: {
					courseID: {
						prefix: "CS",
						number: "1436",
					},
				},
			},
		},
	})
}

const main = async () => {
	await createCoreCurriculumAreas()
	await createCourses()
	await createCSDegree()
	await createUsers()
	await createCrazDegreePlan()
	console.log(`Database has been seeded. 🌱`)
}

main().catch((err) => {
	console.warn("Error while generating seed: \n", err)
})
