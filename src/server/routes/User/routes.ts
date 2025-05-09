import { StatusCodes } from "http-status-codes"
import { Router } from "express"
import { z } from "zod"
const router = Router()

// don't user username later, use email instead
router.get("/:username", async (req, res) => {
	const { data, error } = z
		.object({
			username: z.string(),
		})
		.strict()
		.required()
		.safeParse(req.params)
	if (error) {
		return res.status(StatusCodes.BAD_REQUEST).send(error.errors)
	}
	const { username } = data
	const user = await req.context.prisma.user.findFirst({
		where: { username: username },
		include: { TestCredits: true, TransferCredits: true, DegreePlan: {
			include: {
				DegreePlanCourses: true
			},
		} },
	})
	res.json(user)
})

export default router
