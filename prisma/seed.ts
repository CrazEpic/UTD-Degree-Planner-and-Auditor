import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const createBlock = async () => {
	// const block = await prisma.blockRequirement.create({
	// 	data: {
	// 		block_name: "Block 1",
	// 		NonterminalBlock: {
	// 			create: {},
	// 		},
	// 	},
	// })
	// const block2 = await prisma.blockRequirement.create({
	// 	data: {
	// 		block_name: "Block 2",
	// 		parent_block_id: block.block_id,
	// 		block_position: 1,
	// 		NonterminalBlock: {
	// 			create: {},
	// 		},
	// 	},
	// })
	// const block3 = await prisma.blockRequirement.create({
	// 	data: {
	// 		block_name: "Block 3",
	// 		parent_block_id: block2.block_id,
	// 		block_position: 1,
	// 		NonterminalBlock: {
	// 			create: {},
	// 		},
	// 	},
	// })
	// const block3_1 = await prisma.blockRequirement.create({
	// 	data: {
	// 		block_name: "Block 3.1",
	// 		parent_block_id: block2.block_id,
	// 		block_position: 2,
	// 		TextBlock: {
	// 			create: {
	// 				text: "This is a text block",
	// 			},
	// 		},
	// 	},
	// })
}

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
			name: area,
		})),
	})
}

const createCourses = async () => {
	await prisma.course.create({
		data: {
			prefix: "MATH",
			number: "2413",
			name: "Differential Calculus",
			coreCurriculumAreaName: "Mathematics",
			prequisites: {},
			corequisites: {},
			prerequires_or_corequisites: {},
		},
	})

	await prisma.course.create({
		data: {
			prefix: "CS",
			number: "1436",
			name: "Programming Fundamentals",
			prequisites: {},
			corequisites: {},
			prerequires_or_corequisites: {},
		},
	})
}

const createCSDegree = async () => {
	await prisma.degree.create({
		data: {
			degree_name: "Computer Science",
			degree_year: "2025",
			RootBlock: {
				create: {
					block_name: "Bachelor of Science in Computer Science (2025)",
					NonterminalBlock: {},
					InnerBlocks: {
						create: [
							{
								block_name: "I. Core Curriculum",
								block_position: 1,
								NonterminalBlock: {
									create: {},
								},
								InnerBlocks: {
									create: [
										{
											block_name: "Mathematics",
											NonterminalBlock: {
												create: {},
											},
											InnerBlocks: {
												create: [
													{
														block_name: "Differential Calculus",
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
								block_name: "II. Major Requirements",
								block_position: 2,
								NonterminalBlock: {
									create: {},
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

const main = async () => {
	// await createBlock()
	await createCoreCurriculumAreas()
	await createCourses()
	await createCSDegree()
	await createUsers()
	console.log(`Database has been seeded. 🌱`)
}

main().catch((err) => {
	console.warn("Error while generating seed: \n", err)
})
