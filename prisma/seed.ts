import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const createBlock = async () => {
	const block = await prisma.blockRequirement.create({
		data: {
			block_name: "Block 1",
			NonterminalBlock: {
				create: {},
			},
		},
	})

	const block2 = await prisma.blockRequirement.create({
		data: {
			block_name: "Block 2",
			parent_block_id: block.block_id,
			block_position: 1,
			NonterminalBlock: {
				create: {},
			},
		},
	})

	const block3 = await prisma.blockRequirement.create({
		data: {
			block_name: "Block 3",
			parent_block_id: block2.block_id,
			block_position: 1,
			NonterminalBlock: {
				create: {},
			},
		},
	})
	const block3_1 = await prisma.blockRequirement.create({
		data: {
			block_name: "Block 3.1",
			parent_block_id: block2.block_id,
			block_position: 2,
			TextBlock: {
				create: {
					text: "This is a text block",
				},
			},
		},
	})
}

const main = async () => {
	await createBlock()
	console.log(`Database has been seeded. 🌱`)
}

main().catch((err) => {
	console.warn("Error while generating seed: \n", err)
})
