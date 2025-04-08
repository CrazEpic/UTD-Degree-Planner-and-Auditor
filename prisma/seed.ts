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

const main = async () => {
	await createCoreCurriculumAreas()
	await createCourses()
	await createCSDegree()
	await createUsers()
	console.log(`Database has been seeded. 🌱`)
}

main().catch((err) => {
	console.warn("Error while generating seed: \n", err)
})
