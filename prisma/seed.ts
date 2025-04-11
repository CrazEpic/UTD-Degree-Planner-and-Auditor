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
		prerequisitesOrCorequisites: { logicalOperator: "AND", requisites: [] },
	}

	await prisma.course.createMany({
		data: [
			// not the actual prerequisites, just a placeholder for data
			{
				prefix: "MATH",
				number: "2306",
				name: "Analytic Geometry",
				requisites: emptyRequisites,
			},
			{
				prefix: "MATH",
				number: "2312",
				name: "Precalculus",
				requisites: emptyRequisites,
			},
			{
				prefix: "MATH",
				number: "2413",
				name: "Differential Calculus",
				requisites: {
					prequisites: {
						logicalOperator: "OR",
						requisites: [
							{ type: "custom", text: "ALEKS score required" },
							{
								logicalOperator: "OR",
								requisites: [
									{ type: "course", courseID: "MATH 2306", minGrade: "C-" },
									{ type: "course", courseID: "MATH 2312", minGrade: "C-" },
								],
							},
						],
					},
					corequisites: {},
					prerequisitesOrCorequisites: {},
				},
			},
			{
				prefix: "MATH",
				number: "2417",
				name: "Calculus I",
				requisites: {
					prequisites: {
						logicalOperator: "OR",
						requisites: [
							{ type: "custom", text: "ALEKS score required" },
							{
								logicalOperator: "OR",
								requisites: [
									{ type: "course", courseID: "MATH 2306", minGrade: "C-" },
									{ type: "course", courseID: "MATH 2312", minGrade: "C-" },
								],
							},
						],
					},
					corequisites: {},
					prerequisitesOrCorequisites: {},
				},
			},
			{
				prefix: "ECS",
				number: "1100",
				name: "Introduction to Engineering and Computer Science",
				requisites: {
					prequisites: {},
					corequisites: {},
					prerequisitesOrCorequisites: {},
				},
			},
			{
				prefix: "CS",
				number: "1200",
				name: "Introduction to Computer Science and Software Engineering",
				requisites: {
					prequisites: {},
					corequisites: {},
					prerequisitesOrCorequisites: {},
				},
			},
			{
				prefix: "CS",
				number: "1436",
				name: "Programming Fundamentals",
				requisites: {
					prequisites: {},
					corequisites: {},
					prerequisitesOrCorequisites: {},
				},
			},
			{
				prefix: "CS",
				number: "1337",
				name: "Computer Science I",
				requisites: {
					prequisites: {
						logicalOperator: "AND",
						requisites: { type: "course", courseID: "CS 1436", minGrade: "C" },
					},
					corequisites: {},
					prerequisitesOrCorequisites: {},
				},
			},
			{
				prefix: "CS",
				number: "2305",
				name: "Discrete Mathematics for Computing I",
				requisites: {
					prequisites: {
						logicalOperator: "OR",
						requisites: [
							{ type: "custom", text: "ALEKS score required" },
							{
								logicalOperator: "OR",
								requisites: [
									{ type: "course", courseID: "MATH 2413", minGrade: "C" },
									{ type: "course", courseID: "MATH 2417", minGrade: "C" },
								],
							},
						],
					},
					corequisites: {},
					prerequisitesOrCorequisites: {},
				},
			},
			{
				prefix: "CS",
				number: "2336",
				name: "Computer Science II",
				requisites: {
					prequisites: {
						logicalOperator: "AND",
						requisites: [{ type: "course", courseID: "CS 1337", minGrade: "C" }],
					},
					corequisites: {},
					prerequisitesOrCorequisites: {
						logicalOperator: "AND",
						requisites: [{ type: "course", courseID: "CS 2305", minGrade: "C" }],
					},
				},
			},
			{
				prefix: "CS",
				number: "2340",
				name: "Computer Architecture",
				requisites: {
					prequisites: {
						logicalOperator: "AND",
						requisites: [
							{ type: "course", courseID: "CS 1337", minGrade: "C" },
							{ type: "course", courseID: "CS 2305", minGrade: "C" },
						],
					},
					corequisites: {},
					prerequisitesOrCorequisites: {},
				},
			},
			{
				prefix: "MATH",
				number: "2418",
				name: "Linear Algebra",
				requisites: {
					prequisites: {
						logicalOperator: "OR",
						requisites: [
							{ type: "course", courseID: "MATH 2306", minGrade: "C-" },
							{ type: "course", courseID: "MATH 2413", minGrade: "C-" },
							{ type: "course", courseID: "MATH 2417", minGrade: "C-" },
						],
					},
					corequisites: {},
					prerequisitesOrCorequisites: {},
				},
			},
			{
				prefix: "RHET",
				number: "1302",
				name: "Rhetoric",
				requisites: {
					prequisites: {},
					corequisites: {},
					prerequisitesOrCorequisites: {},
				},
			},
			{
				prefix: "PHYS",
				number: "2125",
				name: "Physics Laboratory I",
				requisites: {
					prequisites: {},
					corequisites: {
						logicalOperator: "AND",
						requisites: [{ type: "course", courseID: "PHYS 2325" }],
					},
					prerequisitesOrCorequisites: {},
				},
			},
			{
				prefix: "PHYS",
				number: "2126",
				name: "Physics Laboratory II",
				requisites: {
					prequisites: {},
					corequisites: {
						logicalOperator: "AND",
						requisites: [{ type: "course", courseID: "PHYS 2326" }],
					},
					prerequisitesOrCorequisites: {},
				},
			},
			{
				prefix: "PHYS",
				number: "2325",
				name: "Mechanics",
				requisites: {
					prequisites: {
						logicalOperator: "OR",
						requisites: [
							{ type: "course", courseID: "MATH 2413" },
							{ type: "course", courseID: "MATH 2417" },
						],
					},
					corequisites: {
						logicalOperator: "AND",
						requisites: [
							{
								logicalOperator: "OR",
								requisites: [
									{ type: "course", courseID: "MATH 2414" },
									{ type: "course", courseID: "MATH 2419" },
								],
							},
							{
								logicalOperator: "AND",
								requisites: [{ type: "course", courseID: "PHYS 2125" }],
							},
						],
					},
					prerequisitesOrCorequisites: {},
				},
			},
			{
				prefix: "PHYS",
				number: "2326",
				name: "Electromagnetism and Waves",
				requisites: {
					prequisites: {
						logicalOperator: "AND",
						requisites: [
							{ type: "course", courseID: "PHYS 2325" },
							{
								logicalOperator: "OR",
								requisites: [
									{ type: "course", courseID: "MATH 2414" },
									{ type: "course", courseID: "MATH 2419" },
								],
							},
						],
					},
					corequisites: {
						logicalOperator: "AND",
						requisites: [{ type: "course", courseID: "PHYS 2126" }],
					},
					prerequisitesOrCorequisites: {},
				},
			},
			{
				prefix: "MATH",
				number: "2414",
				name: "Integral Calculus",
				requisites: {
					prequisites: {
						logicalOperator: "OR",
						requisites: [
							{ type: "course", courseID: "MATH 2413", minGrade: "C-" },
							{ type: "course", courseID: "MATH 2417", minGrade: "C-" },
						],
					},
					corequisites: {},
					prerequisitesOrCorequisites: {},
				},
			},
			{
				prefix: "MATH",
				number: "2419",
				name: "Calculus II",
				requisites: {
					prequisites: {
						logicalOperator: "AND",
						requisites: [{ type: "course", courseID: "MATH 2417", minGrade: "C-" }],
					},
					corequisites: {},
					prerequisitesOrCorequisites: {},
				},
			},
			{
				prefix: "CS",
				number: "3162",
				name: "Professional Responsibility in Computer Science and Software Engineering",
				requisites: {
					prequisites: {},
					corequisites: {},
					prerequisitesOrCorequisites: {
						logicalOperator: "AND",
						requisites: [
							{ type: "course", courseID: "CS 3345" },
							{ type: "course", courseID: "CS 3354" },
						],
					},
				},
			},
			{
				prefix: "CS",
				number: "3341",
				name: "Probability and Statistics in Computer Science and Software Engineering",
				requisites: {
					prequisites: {
						logicalOperator: "AND",
						requisites: [
							{
								logicalOperator: "OR",
								requisites: [
									{ type: "course", courseID: "MATH 1326", minGrade: "C" },
									{ type: "course", courseID: "MATH 2414", minGrade: "C" },
									{ type: "course", courseID: "MATH 2419", minGrade: "C" },
								],
							},
							{ type: "course", courseID: "MATH 2418", minGrade: "C" },
							{ type: "course", courseID: "CS 2305", minGrade: "C" },
						],
					},
					corequisites: {},
					prerequisitesOrCorequisites: {},
				},
			},
			{
				prefix: "CS",
				number: "3345",
				name: "Data Structures and Introduction to Algorithmic Analysis",
				requisites: {
					prequisites: {
						logicalOperator: "AND",
						requisites: [
							{ type: "course", courseID: "CS 2336", minGrade: "C" },
							{ type: "course", courseID: "CS 2305", minGrade: "C" },
						],
					},
					corequisites: {},
					prerequisitesOrCorequisites: {
						logicalOperator: "AND",
						requisites: [{ type: "course", courseID: "CS 3341" }],
					},
				},
			},
			{
				prefix: "CS",
				number: "3354",
				name: "Software Engineering",
				requisites: {
					prequisites: {
						logicalOperator: "AND",
						requisites: [
							{ type: "course", courseID: "CS 2336", minGrade: "C" },
							{ type: "course", courseID: "CS 2305", minGrade: "C" },
						],
					},
					corequisites: {},
					prerequisitesOrCorequisites: {
						logicalOperator: "AND",
						requisites: [{ type: "course", courseID: "ECS 2390" }],
					},
				},
			},
			{
				prefix: "CS",
				number: "3377",
				name: "Systems Programming in UNIX and Other Environments",
				requisites: {
					prequisites: {
						logicalOperator: "AND",
						requisites: [{ type: "course", courseID: "CS 2336", minGrade: "C" }],
					},
					corequisites: {},
					prerequisitesOrCorequisites: {},
				},
			},
			{
				prefix: "ECS",
				number: "2390",
				name: "Professional and Technical Communication",
				requisites: {
					prequisites: {
						logicalOperator: "AND",
						requisites: [{ type: "course", courseID: "RHET 1302" }],
					},
					corequisites: {},
					prerequisitesOrCorequisites: {},
				},
			},
			{
				prefix: "CS",
				number: "4141",
				name: "Digital Systems Laboratory",
				requisites: {
					prequisites: {},
					corequisites: {
						logicalOperator: "AND",
						requisites: [{ type: "course", courseID: "CS 4341" }],
					},
					prerequisitesOrCorequisites: {},
				},
			},
			{
				prefix: "CS",
				number: "4337",
				name: "Programming Language Paradigms",
				requisites: {
					prequisites: {
						logicalOperator: "AND",
						requisites: [
							{ type: "course", courseID: "CS 2336", minGrade: "C" },
							{ type: "course", courseID: "CS 2305", minGrade: "C" },
							{ type: "course", courseID: "CS 2340" },
						],
					},
					corequisites: {},
					prerequisitesOrCorequisites: {},
				},
			},
			{
				prefix: "CS",
				number: "4341",
				name: "Digital Logic and Computer Design",
				requisites: {
					prequisites: {
						logicalOperator: "AND",
						requisites: [
							{ type: "course", courseID: "CS 2340" },
							{ type: "course", courseID: "PHYS 2326" },
						],
					},
					corequisites: {
						logicalOperator: "AND",
						requisites: [{ type: "course", courseID: "CS 4141" }],
					},
					prerequisitesOrCorequisites: {},
				},
			},
			{
				prefix: "CS",
				number: "4347",
				name: "Database Systems",
				requisites: {
					prequisites: {
						logicalOperator: "AND",
						requisites: [{ type: "course", courseID: "CS 3345" }],
					},
					corequisites: {},
					prerequisitesOrCorequisites: {},
				},
			},
			{
				prefix: "CS",
				number: "4348",
				name: "Operating Systems Concepts",
				requisites: {
					prequisites: {
						logicalOperator: "AND",
						requisites: [
							{ type: "course", courseID: "CS 2340" },
							{ type: "course", courseID: "CS 3377" },
							{ type: "course", courseID: "CS 3345" },
						],
					},
					corequisites: {},
					prerequisitesOrCorequisites: {},
				},
			},
			{
				prefix: "CS",
				number: "4349",
				name: "Advanced Algorithm Design and Analysis",
				requisites: {
					prequisites: {
						logicalOperator: "AND",
						requisites: [
							{ type: "course", courseID: "CS 2305", minGrade: "C" },
							{ type: "course", courseID: "CS 3345" },
						],
					},
					corequisites: {},
					prerequisitesOrCorequisites: {},
				},
			},
			{
				prefix: "CS",
				number: "4384",
				name: "Automata Theory",
				requisites: {
					prequisites: {
						logicalOperator: "AND",
						requisites: { type: "course", courseID: "CS 2305", minGrade: "C" },
					},
					corequisites: {},
					prerequisitesOrCorequisites: {},
				},
			},
			// Prerequisites: (CE 3345 or CS 3345 or SE 3345), and (CE 3354 or CS 3354 or SE 3354)
			// or equivalent and at least three CS 43XX classes.
			{
				prefix: "CS",
				number: "4485",
				name: "Computer Science Project",
				requisites: {
					prequisites: {
						logicalOperator: "AND",
						requisites: [
							{ type: "course", courseID: "CS 3345" },
							{ type: "course", courseID: "CS 3354" },
							{
								type: "matcher",
								match: "",
								condition: {
									prefix: "CS",
									level: "4000",
									minCreditHours: 3,
								},
							},
							{
								type: "matcher",
								match: "",
								condition: {
									prefix: "CS",
									level: "4000",
									minCreditHours: 3,
								},
							},
							{
								type: "matcher",
								match: "",
								condition: {
									prefix: "CS",
									level: "4000",
									minCreditHours: 3,
								},
							},
						],
					},
					corequisites: {},
					prerequisitesOrCorequisites: {},
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
											InnerBlocks: {
												create: [
													{
														blockName: "Professional Responsibility in Computer Science and Software Engineering",
														CourseBlock: { create: { Course: { connect: { courseID: { prefix: "CS", number: "3162" } } } } },
													},
													{
														blockName: "Probability and Statistics in Computer Science and Software Engineering",
														CourseBlock: { create: { Course: { connect: { courseID: { prefix: "CS", number: "3341" } } } } },
													},
													{
														blockName: "Data Structures and Introduction to Algorithmic Analysis",
														CourseBlock: { create: { Course: { connect: { courseID: { prefix: "CS", number: "3345" } } } } },
													},
													{
														blockName: "Software Engineering",
														CourseBlock: { create: { Course: { connect: { courseID: { prefix: "CS", number: "3354" } } } } },
													},
													{
														blockName: "Systems Programming in UNIX and Other Environments",
														CourseBlock: { create: { Course: { connect: { courseID: { prefix: "CS", number: "3377" } } } } },
													},
													{
														blockName: "Professional and Technical Communication",
														CourseBlock: { create: { Course: { connect: { courseID: { prefix: "ECS", number: "2390" } } } } },
													},
													{
														blockName: "Digital Systems Laboratory",
														CourseBlock: { create: { Course: { connect: { courseID: { prefix: "CS", number: "4141" } } } } },
													},
													{
														blockName: "Programming Language Paradigms",
														CourseBlock: { create: { Course: { connect: { courseID: { prefix: "CS", number: "4337" } } } } },
													},
													{
														blockName: "Digital Logic and Computer Design",
														CourseBlock: { create: { Course: { connect: { courseID: { prefix: "CS", number: "4341" } } } } },
													},
													{
														blockName: "Database Systems",
														CourseBlock: { create: { Course: { connect: { courseID: { prefix: "CS", number: "4347" } } } } },
													},
													{
														blockName: "Operating Systems Concepts",
														CourseBlock: { create: { Course: { connect: { courseID: { prefix: "CS", number: "4348" } } } } },
													},
													{
														blockName: "Advanced Algorithm Design and Analysis",
														CourseBlock: { create: { Course: { connect: { courseID: { prefix: "CS", number: "4349" } } } } },
													},
													{
														blockName: "Automata Theory",
														CourseBlock: { create: { Course: { connect: { courseID: { prefix: "CS", number: "4384" } } } } },
													},
													{
														blockName: "Computer Science Project",
														CourseBlock: { create: { Course: { connect: { courseID: { prefix: "CS", number: "4485" } } } } },
													},
												],
											},
										},
										{
											blockName: "Major Technical Electives",
											NonterminalBlock: { create: { conditions: emptyConditions } },
											InnerBlocks: {
												create: [],
											},
										},
									],
								},
							},
							{
								blockName: "Elective Requirements",
								NonterminalBlock: { create: { conditions: emptyConditions } },
								InnerBlocks: {
									create: [
										{
											blockName: "Free Electives",
											NonterminalBlock: { create: { conditions: emptyConditions } },
										},
									],
								},
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
