import { OpenApiGeneratorV31, OpenAPIRegistry, extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi"
import { z } from "zod"
import fs from "fs"
import { fileURLToPath } from "url"
import { dirname } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

extendZodWithOpenApi(z)
const registry = new OpenAPIRegistry()

const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()])
type Literal = z.infer<typeof literalSchema>
type Json = Literal | { [key: string]: Json } | Json[]
const jsonSchema: z.ZodType<Json> = z
	.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))
	.openapi({
		type: "object",
	})

export const routeSchemas = {
	"/ - get": {},
	// BUILD COURSE
	"/api/buildCourse/course - post": z
		.object({
			prefix: z.string(),
			number: z.string(),
			name: z.string(),
		})
		.strict()
		.required()
		.openapi("Create a new course"),

	"/api/buildCourse/course - put": z
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
				.optional()
				.openapi("Requisites"),
		})
		.strict()
		.required()
		.openapi("Update a course"),
	// BUILD DEGREE
	"/api/buildDegree/degree - post": z
		.object({
			name: z.string(),
			year: z.string(),
		})
		.strict()
		.required(),
	"/api/buildDegree/insertBlockAtPosition - post": z
		.object({
			parentBlockID: z.string(),
			position: z.number().nonnegative(),
			blockTypeInformation: z.discriminatedUnion("blockType", [
				z.object({ blockType: z.literal("NONTERMINAL") }),
				z.object({ blockType: z.literal("COURSE"), prefix: z.string(), number: z.string() }),
				z.object({ blockType: z.literal("TEXT") }),
			]),
		})
		.strict()
		.required(),
	"/api/buildDegree/deleteBlock - delete": z
		.object({
			blockID: z.string(),
		})
		.strict()
		.required(),
	"/api/buildDegree/updateBlockName - put": z
		.object({
			blockID: z.string(),
			blockName: z.string(),
		})
		.strict()
		.required(),
	"/api/buildDegree/updateTextBlock - put": z
		.object({
			blockID: z.string(),
			text: z.string(),
		})
		.strict()
		.required(),
	"/api/buildDegree/updateNonterminalBlockCondition - put": z
		.object({
			blockID: z.string(),
			conditions: z
				.object({
					blockFulfillmentCondition: z
						.object({
							blocksToFulfill: z.number().positive(),
						})
						.optional(),
					minBlockInclusionCondition: z
						.object({
							minBlocksToInclude: z.number().positive(),
						})
						.optional(),
					creditHourCondition: z
						.object({
							minCreditHours: z.number().positive(),
						})
						.optional(),
					levelCondition: z
						.object({
							creditHourRequirement: z.number().positive(),
							level: z.enum(["1000", "2000", "3000", "4000", "UPPER_DIVISION"]),
						})
						.optional(),
					hourBeyondBlockCondition: z
						.object({
							blockKey: z.string(),
							hoursBeyondBlock: z.number().positive(),
						})
						.optional(),
				})
				.strict(),
		})
		.strict()
		.required(),
	// COURSE
	"/api/course/courses - get": {},
	"/api/course/course - get": z
		.object({
			prefix: z.string(),
			number: z.string(),
		})
		.strict()
		.required(),
	// DEGREE
	"/api/degree/degrees - get": {},
	"/api/degree/:name/:year - get": z.object({
		name: z.string(),
		year: z.string(),
	}),
	// DEGREE PLAN
	"/api/degreePlan/:degreePlanID - get": z
		.object({
			degreePlanID: z.string(),
		})
		.strict()
		.required(),
	"/api/degreePlan/ - post": z
		.object({
			userID: z.string(),
			degreeID: z.object({
				degreeName: z.string(),
				degreeYear: z.string(),
			}),
			name: z.string(),
		})
		.strict()
		.required(),
	"/api/degreePlan/addCourse - post": z
		.object({
			degreePlanID: z.string(),
			course: z.object({
				prefix: z.string(),
				number: z.string(),
			}),
		})
		.strict()
		.required(),
	"/api/degreePlan/removeCourse - delete": z
		.object({
			degreePlanCourseID: z.string(),
		})
		.strict()
		.required(),
	"/api/degreePlan/updateCourseSemester - put": z
		.object({
			degreePlanCourseID: z.string(),
			semester: z
				.object({
					semesterTerm: z.enum(["FALL", "SPRING", "SUMMER"]),
					semesterYear: z.string(),
				})
				.nullable(),
		})
		.strict()
		.required(),
	"/api/degreePlan/:degreePlanID/getAllCourseToRequirementBlockLinks - get": z
		.object({
			degreePlanID: z.string(),
		})
		.strict()
		.required(),
	"/api/degreePlan/linkCourseToRequirementBlock - put": z
		.object({
			degreePlanCourseID: z.string(),
			blockID: z.string(),
			credit: z.number().int().nonnegative(),
		})
		.strict()
		.required(),
	"/api/degreePlan/unlinkCourseFromRequirementBlock - delete": z
		.object({
			degreePlanCourseID: z.string(),
			blockID: z.string(),
		})
		.strict()
		.required(),
	"/api/degreePlan/addTransferCredit - post": z
		.object({
			userID: z.string(),
			transferCourseEquivalencyID: z.string(),
		})
		.strict()
		.required(),
	"/api/degreePlan/applyTransferCredit - post": z
		.object({
			userID: z.string(),
			degreePlanID: z.string(),
			prefix: z.string(),
			number: z.string(),
			transferCourseEquivalencyID: z.string(),
		})
		.strict()
		.required(),
	// TEST AND TRANSFER CREDITS
	"/api/testAndTransferCredits/transferCreditSchools - get": {},
	"/api/testAndTransferCredits/transferCreditEquivalenciesByUTDCourse - get": z
		.object({
			prefix: z.string().nonempty().toUpperCase(),
			number: z.string().length(4).toUpperCase(),
			schoolsFilter: z.string().optional(),
		})
		.strict(),
	"/api/testAndTransferCredits/transferCreditEquivalenciesByTransferSchool - get": z
		.object({
			transferSchoolSchoolID: z.string().nonempty().toUpperCase(),
		})
		.strict(),
	// USER
	"/api/user/:username - get": z
		.object({
			username: z.string(),
		})
		.strict()
		.required(),
}

Object.freeze(routeSchemas)

// Register all the routes

registry.registerPath({
	path: "/",
	method: "get",
	description: "Serve the static files from the dist folder",
	summary: "Serve the static files from the dist folder",
	responses: {
		200: {
			description: "OK",
			content: {
				"text/html": {
					schema: {
						type: "string",
					},
				},
			},
		},
	},
})

registry.registerPath({
	path: "/api/buildCourse/course",
	method: "post",
	description: "Create a new course",
	summary: "Create a new course",
	request: {
		body: {
			content: {
				"application/json": { schema: routeSchemas["/api/buildCourse/course - post"] },
			},
		},
	},
	responses: {
		200: {
			description: "OK",
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {},
					},
				},
			},
		},
	},
})

registry.registerPath({
	path: "/api/buildCourse/course",
	method: "put",
	description: "Update a course",
	summary: "Update a course",
	request: {
		body: {
			content: {
				"application/json": { schema: routeSchemas["/api/buildCourse/course - put"] },
			},
		},
	},
	responses: {
		200: {
			description: "OK",
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {},
					},
				},
			},
		},
	},
})

registry.registerPath({
	path: "/api/buildDegree/degree",
	method: "post",
	description: "Create a new degree",
	summary: "Create a new degree",
	request: {
		body: {
			content: {
				"application/json": { schema: routeSchemas["/api/buildDegree/degree - post"] },
			},
		},
	},
	responses: {
		200: {
			description: "OK",
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {},
					},
				},
			},
		},
	},
})

registry.registerPath({
	path: "/api/buildDegree/insertBlockAtPosition",
	method: "post",
	description: "Insert a block at a position",
	summary: "Insert a block at a position",
	request: {
		body: {
			content: {
				"application/json": { schema: routeSchemas["/api/buildDegree/insertBlockAtPosition - post"] },
			},
		},
	},
	responses: {
		200: {
			description: "OK",
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {},
					},
				},
			},
		},
	},
})

registry.registerPath({
	path: "/api/buildDegree/deleteBlock",
	method: "delete",
	description: "Delete a block",
	summary: "Delete a block",
	request: {
		body: {
			content: {
				"application/json": { schema: routeSchemas["/api/buildDegree/deleteBlock - delete"] },
			},
		},
	},
	responses: {
		200: {
			description: "OK",
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {},
					},
				},
			},
		},
	},
})

registry.registerPath({
	path: "/api/buildDegree/updateBlockName",
	method: "put",
	description: "Update a block name",
	summary: "Update a block name",
	request: {
		body: {
			content: {
				"application/json": { schema: routeSchemas["/api/buildDegree/updateBlockName - put"] },
			},
		},
	},
	responses: {
		200: {
			description: "OK",
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {},
					},
				},
			},
		},
	},
})

registry.registerPath({
	path: "/api/buildDegree/updateTextBlock",
	method: "put",
	description: "Update a text block",
	summary: "Update a text block",
	request: {
		body: {
			content: {
				"application/json": { schema: routeSchemas["/api/buildDegree/updateTextBlock - put"] },
			},
		},
	},
	responses: {
		200: {
			description: "OK",
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {},
					},
				},
			},
		},
	},
})

registry.registerPath({
	path: "/api/buildDegree/updateNonterminalBlockCondition",
	method: "put",
	description: "Update a nonterminal block condition",
	summary: "Update a nonterminal block condition",
	request: {
		body: {
			content: {
				"application/json": { schema: routeSchemas["/api/buildDegree/updateNonterminalBlockCondition - put"] },
			},
		},
	},
	responses: {
		200: {
			description: "OK",
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {},
					},
				},
			},
		},
	},
})

registry.registerPath({
	path: "/api/course/courses",
	method: "get",
	description: "Get all courses",
	summary: "Get all courses",
	responses: {
		200: {
			description: "OK",
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {},
					},
				},
			},
		},
	},
})

registry.registerPath({
	path: "/api/course/course",
	method: "get",
	description: "Get a course by prefix and number",
	summary: "Get a course by prefix and number",
	request: {
		params: routeSchemas["/api/course/course - get"],
	},
	responses: {
		200: {
			description: "OK",
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {},
					},
				},
			},
		},
	},
})

registry.registerPath({
	path: "/api/degree/degrees",
	method: "get",
	description: "Get all degrees",
	summary: "Get all degrees",
	responses: {
		200: {
			description: "OK",
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {},
					},
				},
			},
		},
	},
})

registry.registerPath({
	path: "/api/degree/:name/:year",
	method: "get",
	description: "Get a degree by name and year",
	summary: "Get a degree by name and year",
	request: {
		params: routeSchemas["/api/degree/:name/:year - get"],
	},
	responses: {
		200: {
			description: "OK",
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {},
					},
				},
			},
		},
	},
})

registry.registerPath({
	path: "/api/degreePlan/:degreePlanID",
	method: "get",
	description: "Get a degree plan by ID",
	summary: "Get a degree plan by ID",
	request: {
		params: routeSchemas["/api/degreePlan/:degreePlanID - get"],
	},
	responses: {
		200: {
			description: "OK",
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {},
					},
				},
			},
		},
	},
})

registry.registerPath({
	path: "/api/degreePlan/",
	method: "post",
	description: "Create a new degree plan",
	summary: "Create a new degree plan",
	request: {
		body: {
			content: {
				"application/json": { schema: routeSchemas["/api/degreePlan/ - post"] },
			},
		},
	},
	responses: {
		200: {
			description: "OK",
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {},
					},
				},
			},
		},
	},
})

registry.registerPath({
	path: "/api/degreePlan/addCourse",
	method: "post",
	description: "Add a course to a degree plan",
	summary: "Add a course to a degree plan",
	request: {
		body: {
			content: {
				"application/json": { schema: routeSchemas["/api/degreePlan/addCourse - post"] },
			},
		},
	},
	responses: {
		200: {
			description: "OK",
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {},
					},
				},
			},
		},
	},
})

registry.registerPath({
	path: "/api/degreePlan/removeCourse",
	method: "delete",
	description: "Remove a course from a degree plan",
	summary: "Remove a course from a degree plan",
	request: {
		body: {
			content: {
				"application/json": { schema: routeSchemas["/api/degreePlan/removeCourse - delete"] },
			},
		},
	},
	responses: {
		200: {
			description: "OK",
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {},
					},
				},
			},
		},
	},
})

registry.registerPath({
	path: "/api/degreePlan/updateCourseSemester",
	method: "put",
	description: "Update a course's semester in a degree plan",
	summary: "Update a course's semester in a degree plan",
	request: {
		body: {
			content: {
				"application/json": { schema: routeSchemas["/api/degreePlan/updateCourseSemester - put"] },
			},
		},
	},
	responses: {
		200: {
			description: "OK",
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {},
					},
				},
			},
		},
	},
})

registry.registerPath({
	path: "/api/degreePlan/:degreePlanID/getAllCourseToRequirementBlockLinks",
	method: "get",
	description: "Get all course to requirement block links",
	summary: "Get all course to requirement block links",
	request: {
		params: routeSchemas["/api/degreePlan/:degreePlanID/getAllCourseToRequirementBlockLinks - get"],
	},
	responses: {
		200: {
			description: "OK",
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {},
					},
				},
			},
		},
	},
})

registry.registerPath({
	path: "/api/degreePlan/linkCourseToRequirementBlock",
	method: "put",
	description: "Link a course to a requirement block",
	summary: "Link a course to a requirement block",
	request: {
		body: {
			content: {
				"application/json": { schema: routeSchemas["/api/degreePlan/linkCourseToRequirementBlock - put"] },
			},
		},
	},
	responses: {
		200: {
			description: "OK",
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {},
					},
				},
			},
		},
	},
})

registry.registerPath({
	path: "/api/degreePlan/unlinkCourseFromRequirementBlock",
	method: "delete",
	description: "Unlink a course from a requirement block",
	summary: "Unlink a course from a requirement block",
	request: {
		body: {
			content: {
				"application/json": { schema: routeSchemas["/api/degreePlan/unlinkCourseFromRequirementBlock - delete"] },
			},
		},
	},
	responses: {
		200: {
			description: "OK",
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {},
					},
				},
			},
		},
	},
})

registry.registerPath({
	path: "/api/degreePlan/addTransferCredit",
	method: "post",
	description: "Add a transfer credit",
	summary: "Add a transfer credit",
	request: {
		body: {
			content: {
				"application/json": { schema: routeSchemas["/api/degreePlan/addTransferCredit - post"] },
			},
		},
	},
	responses: {
		200: {
			description: "OK",
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {},
					},
				},
			},
		},
	},
})

registry.registerPath({
	path: "/api/degreePlan/applyTransferCredit",
	method: "post",
	description: "Apply a transfer credit",
	summary: "Apply a transfer credit",
	request: {
		body: {
			content: {
				"application/json": { schema: routeSchemas["/api/degreePlan/applyTransferCredit - post"] },
			},
		},
	},
	responses: {
		200: {
			description: "OK",
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {},
					},
				},
			},
		},
	},
})

registry.registerPath({
	path: "/api/testAndTransferCredits/transferCreditSchools",
	method: "get",
	description: "Get all transfer credit schools",
	summary: "Get all transfer credit schools",
	responses: {
		200: {
			description: "OK",
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {},
					},
				},
			},
		},
	},
})

registry.registerPath({
	path: "/api/testAndTransferCredits/transferCreditEquivalenciesByUTDCourse",
	method: "get",
	description: "Get transfer credit equivalencies by UTD course",
	summary: "Get transfer credit equivalencies by UTD course",
	request: {
		query: routeSchemas["/api/testAndTransferCredits/transferCreditEquivalenciesByUTDCourse - get"],
	},
	responses: {
		200: {
			description: "OK",
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {},
					},
				},
			},
		},
	},
})

registry.registerPath({
	path: "/api/testAndTransferCredits/transferCreditEquivalenciesByTransferSchool",
	method: "get",
	description: "Get transfer credit equivalencies by transfer school",
	summary: "Get transfer credit equivalencies by transfer school",
	request: {
		query: routeSchemas["/api/testAndTransferCredits/transferCreditEquivalenciesByTransferSchool - get"],
	},
	responses: {
		200: {
			description: "OK",
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {},
					},
				},
			},
		},
	},
})

registry.registerPath({
	path: "/api/user/:username",
	method: "get",
	description: "Get a user by username",
	summary: "Get a user by username",
	request: {
		params: routeSchemas["/api/user/:username - get"],
	},
	responses: {
		200: {
			description: "OK",
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {},
					},
				},
			},
		},
	},
})

// Check for undocumented APIs
const undocumentedAPIs = Object.keys(routeSchemas).filter((key) => {
	if (
		registry.definitions.find((def) => {
			return def.type === "route" && `${def.route.path} - ${def.route.method}` === key
		})
	) {
		return false
	}
	return true
})

if (undocumentedAPIs.length > 0) {
	console.log("Undocumented APIs:")
	undocumentedAPIs.forEach((key) => {
		console.log(key)
	})
}

// Check for old documented APIs
const oldDocumentedAPIs = registry.definitions.filter((def) => {
	return def.type === "route" && !(`${def.route.path} - ${def.route.method}` in routeSchemas)
})

if (oldDocumentedAPIs.length > 0) {
	console.log("Old documented APIs:")
	oldDocumentedAPIs.forEach((def) => {
		console.log(`${def.route.path} - ${def.route.method}`)
	})
}

console.log(registry.definitions.length, "APIs documented")

// openapi documentation
const getOpenApiDocumentation = () => {
	const generator = new OpenApiGeneratorV31(registry.definitions)

	return generator.generateDocument({
		openapi: "3.1.0",
		info: {
			version: "1.0.0",
			title: "UTD Degree Planner and Auditor",
			description: "API Documentation for UTD Degree Planner and Auditor",
		},
		servers: [{ url: "http://localhost:3000/" }],
	})
}

export const writeDocumentation = () => {
	const docs = getOpenApiDocumentation()

	fs.writeFileSync(`${__dirname}/swagger.json`, JSON.stringify(docs, null, 4), {
		encoding: "utf-8",
	})
}

export const getDocumentation = () => {
	//
	return JSON.parse(fs.readFileSync(`${__dirname}/swagger.json`, "utf-8"))
}
