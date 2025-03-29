const main = async () => {
	console.log(`Database has been seeded. 🌱`)
}

main().catch((err) => {
	console.warn("Error while generating seed: \n", err)
})
