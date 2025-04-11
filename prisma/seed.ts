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

	await prisma.course.createMany({
		data: [
			{
				prefix: "MATH",
				number: "2413",
				name: "Differential Calculus",
				requisites: {
					prequisites: {},
					corequisites: {},
					prerequiresOrCorequisites: {},
				},
			},
			{
				prefix: "MATH",
				number: "2417",
				name: "Calculus I",
				requisites: {
					prequisites: {},
					corequisites: {},
					prerequiresOrCorequisites: {},
				},
			},
			{
				prefix: "ECS",
				number: "1100",
				name: "Introduction to Engineering and Computer Science",
				requisites: {
					prequisites: {},
					corequisites: {},
					prerequiresOrCorequisites: {},
				},
			},
			{
				prefix: "CS",
				number: "1200",
				name: "Introduction to Computer Science and Software Engineering",
				requisites: {
					prequisites: {},
					corequisites: {},
					prerequiresOrCorequisites: {},
				},
			},
			{
				prefix: "CS",
				number: "1436",
				name: "Programming Fundamentals",
				requisites: {
					prequisites: {},
					corequisites: {},
					prerequiresOrCorequisites: {},
				},
			},
			{
				prefix: "CS",
				number: "1337",
				name: "Computer Science I",
				requisites: {
					prequisites: {},
					corequisites: {},
					prerequiresOrCorequisites: {},
				},
			},
			{
				prefix: "CS",
				number: "2305",
				name: "Discrete Mathematics for Computing I",
				requisites: {
					prequisites: {},
					corequisites: {},
					prerequiresOrCorequisites: {},
				},
			},
			{
				prefix: "CS",
				number: "2336",
				name: "Computer Science II",
				requisites: {
					prequisites: {},
					corequisites: {},
					prerequiresOrCorequisites: {},
				},
			},
			{
				prefix: "CS",
				number: "2340",
				name: "Computer Architecture",
				requisites: {
					prequisites: {},
					corequisites: {},
					prerequiresOrCorequisites: {},
				},
			},
			{
				prefix: "MATH",
				number: "2418",
				name: "Linear Algebra",
				requisites: {
					prequisites: {},
					corequisites: {},
					prerequiresOrCorequisites: {},
				},
			},
			{
				prefix: "RHET",
				number: "1302",
				name: "Rhetoric",
				requisites: {
					prequisites: {},
					corequisites: {},
					prerequiresOrCorequisites: {},
				},
			},
			{
				prefix: "PHYS",
				number: "2125",
				name: "Physics Laboratory I",
				requisites: {
					prequisites: {},
					corequisites: {},
					prerequiresOrCorequisites: {},
				},
			},
			{
				prefix: "PHYS",
				number: "2126",
				name: "Physics Laboratory II",
				requisites: {
					prequisites: {},
					corequisites: {},
					prerequiresOrCorequisites: {},
				},
			},
			{
				prefix: "PHYS",
				number: "2325",
				name: "Mechanics",
				requisites: {
					prequisites: {},
					corequisites: {},
					prerequiresOrCorequisites: {},
				},
			},
			{
				prefix: "PHYS",
				number: "2326",
				name: "Electromagnetism and Waves",
				requisites: {
					prequisites: {},
					corequisites: {},
					prerequiresOrCorequisites: {},
				},
			},
			{
				prefix: "MATH",
				number: "2414",
				name: "Integral Calculus",
				requisites: {
					prequisites: {},
					corequisites: {},
					prerequiresOrCorequisites: {},
				},
			},
			{
				prefix: "MATH",
				number: "2419",
				name: "Calculus II",
				requisites: {
					prequisites: {},
					corequisites: {},
					prerequiresOrCorequisites: {},
				},
			},
			{
				prefix: "CS",
				number: "3162",
				name: "Professional Responsibility in Computer Science and Software Engineering",
				requisites: {
					prequisites: {},
					corequisites: {},
					prerequiresOrCorequisites: {},
				},
			},
			{
				prefix: "CS",
				number: "3341",
				name: "Probability and Statistics in Computer Science and Software Engineering",
				requisites: {
					prequisites: {},
					corequisites: {},
					prerequiresOrCorequisites: {},
				},
			},
			{
				prefix: "CS",
				number: "3345",
				name: "Data Structures and Introduction to Algorithmic Analysis",
				requisites: {
					prequisites: {},
					corequisites: {},
					prerequiresOrCorequisites: {},
				},
			},
			{
				prefix: "CS",
				number: "3354",
				name: "Software Engineering",
				requisites: {
					prequisites: {},
					corequisites: {},
					prerequiresOrCorequisites: {},
				},
			},
			{
				prefix: "CS",
				number: "3377",
				name: "Systems Programming in UNIX and Other Environments",
				requisites: {
					prequisites: {},
					corequisites: {},
					prerequiresOrCorequisites: {},
				},
			},
			{
				prefix: "ECS",
				number: "2390",
				name: "Professional and Technical Communication",
				requisites: {
					prequisites: {},
					corequisites: {},
					prerequiresOrCorequisites: {},
				},
			},
			{
				prefix: "CS",
				number: "4141",
				name: "Digital Systems Laboratory",
				requisites: {
					prequisites: {},
					corequisites: {},
					prerequiresOrCorequisites: {},
				},
			},
			{
				prefix: "CS",
				number: "4337",
				name: "Programming Language Paradigms",
				requisites: {
					prequisites: {},
					corequisites: {},
					prerequiresOrCorequisites: {},
				},
			},
			{
				prefix: "CS",
				number: "4341",
				name: "Digital Logic and Computer Design",
				requisites: {
					prequisites: {},
					corequisites: {},
					prerequiresOrCorequisites: {},
				},
			},
			{
				prefix: "CS",
				number: "4347",
				name: "Database Systems",
				requisites: {
					prequisites: {},
					corequisites: {},
					prerequiresOrCorequisites: {},
				},
			},
			{
				prefix: "CS",
				number: "4348",
				name: "Operating Systems Concepts",
				requisites: {
					prequisites: {},
					corequisites: {},
					prerequiresOrCorequisites: {},
				},
			},
			{
				prefix: "CS",
				number: "4349",
				name: "Advanced Algorithm Design and Analysis",
				requisites: {
					prequisites: {},
					corequisites: {},
					prerequiresOrCorequisites: {},
				},
			},
			{
				prefix: "CS",
				number: "4384",
				name: "Automata Theory",
				requisites: {
					prequisites: {},
					corequisites: {},
					prerequiresOrCorequisites: {},
				},
			},
			{
				prefix: "CS",
				number: "4485",
				name: "Computer Science Project",
				requisites: {
					prequisites: {},
					corequisites: {},
					prerequiresOrCorequisites: {},
				},
			},
		],
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
								blockPosition: 0,
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
														CourseBlock: { create: { Course: { connect: { courseID: { prefix: "MATH", number: "2413" } } } } },
													},
													{
														blockName: "Calculus I",
														CourseBlock: { create: { Course: { connect: { courseID: { prefix: "MATH", number: "2417" } } } } },
													},
												],
											},
										},
									],
								},
							},
							{
								blockName: "II. Major Requirements",
								blockPosition: 1,
								NonterminalBlock: { create: { conditions: emptyConditions } },
								InnerBlocks: {
									create: [
										{
											blockName: "Major Preparatory Courses",
											NonterminalBlock: { create: { conditions: emptyConditions } },
											InnerBlocks: {
												create: [
													{
														blockName: "Introduction to Engineering and Computer Science",
														CourseBlock: { create: { Course: { connect: { courseID: { prefix: "ECS", number: "1100" } } } } },
													},
													{
														blockName: "Introduction to Computer Science and Software Engineering",
														CourseBlock: { create: { Course: { connect: { courseID: { prefix: "CS", number: "1200" } } } } },
													},
													{
														blockName: "Programming Fundamentals",
														CourseBlock: { create: { Course: { connect: { courseID: { prefix: "CS", number: "1436" } } } } },
													},
													{
														blockName: "Computer Science I",
														CourseBlock: { create: { Course: { connect: { courseID: { prefix: "CS", number: "1337" } } } } },
													},
													{
														blockName: "Discrete Mathematics for Computing I",
														CourseBlock: { create: { Course: { connect: { courseID: { prefix: "CS", number: "2305" } } } } },
													},
													{
														blockName: "Computer Science II",
														CourseBlock: { create: { Course: { connect: { courseID: { prefix: "CS", number: "2336" } } } } },
													},
													{
														blockName: "Computer Architecture",
														CourseBlock: { create: { Course: { connect: { courseID: { prefix: "CS", number: "2340" } } } } },
													},
													{
														blockName: "Linear Algebra",
														CourseBlock: { create: { Course: { connect: { courseID: { prefix: "MATH", number: "2418" } } } } },
													},
													{
														blockName: "Rhetoric",
														CourseBlock: { create: { Course: { connect: { courseID: { prefix: "RHET", number: "1302" } } } } },
													},
													{
														blockName: "Physics Laboratory I",
														CourseBlock: { create: { Course: { connect: { courseID: { prefix: "PHYS", number: "2125" } } } } },
													},
													{
														blockName: "Physics Laboratory II",
														CourseBlock: { create: { Course: { connect: { courseID: { prefix: "PHYS", number: "2126" } } } } },
													},
													{
														blockName: "Mechanics",
														CourseBlock: { create: { Course: { connect: { courseID: { prefix: "PHYS", number: "2325" } } } } },
													},
													{
														blockName: "Electromagnetism and Waves",
														CourseBlock: { create: { Course: { connect: { courseID: { prefix: "PHYS", number: "2326" } } } } },
													},
													{
														blockName: "Math Sequence",
														NonterminalBlock: { create: { conditions: emptyConditions } },
														InnerBlocks: {
															create: [
																{
																	blockName: "",
																	NonterminalBlock: { create: { conditions: emptyConditions } },
																	InnerBlocks: {
																		create: [
																			{
																				blockName: "Differential Calculus",
																				CourseBlock: {
																					create: {
																						Course: { connect: { courseID: { prefix: "MATH", number: "2413" } } },
																					},
																				},
																			},
																			{
																				blockName: "Integral Calculus",
																				CourseBlock: {
																					create: {
																						Course: { connect: { courseID: { prefix: "MATH", number: "2414" } } },
																					},
																				},
																			},
																		],
																	},
																},
																{
																	blockName: "",
																	NonterminalBlock: { create: { conditions: emptyConditions } },
																	InnerBlocks: {
																		create: [
																			{
																				blockName: "Calculus I",
																				CourseBlock: {
																					create: {
																						Course: { connect: { courseID: { prefix: "MATH", number: "2417" } } },
																					},
																				},
																			},
																			{
																				blockName: "Calculus II",
																				CourseBlock: {
																					create: {
																						Course: { connect: { courseID: { prefix: "MATH", number: "2419" } } },
																					},
																				},
																			},
																		],
																	},
																},
															],
														},
													},
												],
											},
										},
										{
											blockName: "Major Core Courses",
											NonterminalBlock: { create: { conditions: emptyConditions } },
											InnerBlocks: {},
										},
										{
											blockName: "Major Technical Electives",
											NonterminalBlock: { create: { conditions: emptyConditions } },
											InnerBlocks: {},
										},
									],
								},
							},
							{
								blockName: "Major Technical Electives",
								NonterminalBlock: { create: { conditions: emptyConditions } },
								InnerBlocks: {},
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
