import jsonSchemaToZod from "json-schema-to-zod"

import fs from "fs"

const a = JSON.parse(fs.readFileSync("./prisma/json-schema/json-schema.json", "utf8"))
const b = {}

Object.keys(a.definitions).forEach((key) => {
	b[key] = jsonSchemaToZod(a.definitions[key])
})

fs.writeFileSync(
	"./prisma/json-schema/prisma-zod-objects.ts",
	`
import { z } from "zod"
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi"
extendZodWithOpenApi(z)

export const prismaZodSchemas = {
${Object.keys(b)
	.map((key) => {
		return `"${key}": ${b[key]},`
	})
	.join("\n")}
}
`.replaceAll("z.union([z.number(), z.string(), z.boolean(), z.record(z.any()), z.array(z.any()), z.null()]).optional()", "z.object({}).optional()")
)
