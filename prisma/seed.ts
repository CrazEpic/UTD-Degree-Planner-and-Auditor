import { PrismaClient } from "@prisma/client"
import { DegreeConditions } from "../src/server/types/degree"
import fs from "fs"

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
	const courses = Object.values(JSON.parse(fs.readFileSync("./prisma/seedData/courseInfo.json", "utf-8")))
	await prisma.course.createMany({
		data: courses,
	})
}

const createTransferCourses = async () => {
	const transferInfo = JSON.parse(fs.readFileSync("./prisma/seedData/transferInfo.json", "utf-8"))
	const transferSchools = Object.keys(transferInfo).map((schoolID) => ({
		schoolID: schoolID,
		schoolName: transferInfo[schoolID].schoolName ?? "",
		schoolCity: transferInfo[schoolID].schoolCity ?? "",
		schoolState: transferInfo[schoolID].schoolState ?? "",
		schoolCountry: transferInfo[schoolID].schoolCountry ?? "",
	}))
	await prisma.transferSchool.createMany({
		data: transferSchools,
	})
	const transferCourseEquivalencies = Object.keys(transferInfo).flatMap((schoolID) => {
		return transferInfo[schoolID].TransferCourseEquivalencies.map((equivalency) => ({
			transferCourseID: equivalency.transferCourseID,
			transferCourseName: equivalency.transferCourseName,
			utdCourseEquivalency: equivalency.utdCourseEquivalency,
			utdCourseEquivalencyName: equivalency.utdCourseEquivalencyName,
			transferSchoolSchoolID: equivalency.transferSchoolSchoolID,
		}))
	})
	await prisma.transferCourseEquivalency.createMany({
		data: transferCourseEquivalencies,
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
						create: {
							conditions: {
								blockFulfillmentCondition: { blocksToFulfill: 3 },
							},
						},
					},
					InnerBlocks: {
						create: [
							{
								blockName: "I. Core Curriculum",
								blockPosition: 0,
								NonterminalBlock: {
									create: {
										conditions: {
											blockFulfillmentCondition: { blocksToFulfill: 1 },
										},
									},
								},
								InnerBlocks: {
									create: [
										{
											blockName: "Mathematics",
											NonterminalBlock: {
												create: {
													conditions: {
														blockFulfillmentCondition: { blocksToFulfill: 1 },
													},
												},
											},
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
								NonterminalBlock: {
									create: {
										conditions: {
											blockFulfillmentCondition: { blocksToFulfill: 3 },
										},
									},
								},
								InnerBlocks: {
									create: [
										{
											blockName: "Major Preparatory Courses",
											NonterminalBlock: {
												create: {
													conditions: {
														blockFulfillmentCondition: { blocksToFulfill: 14 },
													},
												},
											},
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
														NonterminalBlock: {
															create: {
																conditions: {
																	blockFulfillmentCondition: { blocksToFulfill: 1 },
																},
															},
														},
														InnerBlocks: {
															create: [
																{
																	blockName: "",
																	NonterminalBlock: {
																		create: {
																			conditions: {
																				blockFulfillmentCondition: { blocksToFulfill: 2 },
																			},
																		},
																	},
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
																	NonterminalBlock: {
																		create: {
																			conditions: {
																				blockFulfillmentCondition: { blocksToFulfill: 2 },
																			},
																		},
																	},
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
											NonterminalBlock: {
												create: {
													conditions: {
														blockFulfillmentCondition: { blocksToFulfill: 14 },
													},
												},
											},
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
}

const main = async () => {
	await createCoreCurriculumAreas()
	await createCourses()
	await createTransferCourses()
	await createCSDegree()
	await createUsers()
	await createCrazDegreePlan()
	console.log(`Database has been seeded. 🌱`)
}

main().catch((err) => {
	console.warn("Error while generating seed: \n", err)
})
