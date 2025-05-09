import { Router } from "express"
import { StatusCodes } from "http-status-codes"
import { z } from "zod"
const router = Router()

router.post("/course", async (req, res) => {
	const { data, error } = z
		.object({
			prefix: z.string(),
			number: z.string(),
			name: z.string(),
		})
		.strict()
		.required()
		.safeParse(req.body)
	if (error) {
		return res.status(StatusCodes.BAD_REQUEST).send(error.errors)
	}
	const { prefix, number, name } = data
	const course = await req.context.prisma.course.create({
		data: {
			prefix: prefix,
			number: number,
			name: name,
			requisites: {
				prerequisites: {},
				corequisites: {},
				prerequisitesOrCorequisites: {},
			},
		},
	})
	res.json(course)
})

const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()])
type Literal = z.infer<typeof literalSchema>
type Json = Literal | { [key: string]: Json } | Json[]
const jsonSchema: z.ZodType<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

router.put("/course", async (req, res) => {
	const { data, error } = z
		.object({
			prefix: z.string(),
			number: z.string(),
			name: z.string().optional(),
			requisites: z
				.object({
					prerequisites: jsonSchema,
					corequisites: jsonSchema,
					prerequisitesOrCorequisites: jsonSchema,
				})
				.optional(),
		})
		.strict()
		.required({
			prefix: true,
			number: true,
		})
		.safeParse(req.body)
	if (error) {
		return res.status(StatusCodes.BAD_REQUEST).send(error.errors)
	}
	const { prefix, number, name, requisites } = data
	const course = await req.context.prisma.course.update({
		where: {
			courseID: {
				prefix: prefix,
				number: number,
			},
		},
		data: {
			name: name,
			requisites: requisites,
		},
	})
	res.json(course)
})

export default router
