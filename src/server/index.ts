import express from "express"
import swaggerUI from "swagger-ui-express"
import { fileURLToPath } from "url"
import { dirname } from "path"
import path from "path"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import cors from "cors"
import { log } from "./middleware/01.log"
import { authentication } from "./middleware/02.authentication"
import { authorization } from "./middleware/03.authorization"
import { PrismaClient } from "@prisma/client"
import router from "./routes/routes.ts"
import errorHandler from "./error.ts"
import { writeDocumentation, getDocumentation } from "./routes/routeSchema.ts"

interface Context {
	permissions: { [id: string]: boolean }
	prisma: PrismaClient
}

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace Express {
		export interface Request {
			context: Context
		}
	}
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const app = express()
const PORT = process.env.PORT
const prisma = new PrismaClient()

writeDocumentation()
const swaggerDocument = getDocumentation()

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument, { explorer: true }))
app.use(express.static(path.join(__dirname, "../../dist")))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())

// placeholder for the context object
// this will be used to pass the prisma client and permissions to the routes
app.use((req, res, next) => {
	req.context = {
		prisma: prisma,
		permissions: {},
	}
	next()
})

// middlewares
app.use(log)
app.use(authentication)
app.use(authorization)

// routes
app.use("/api", router)

// meant to serve static files after vite build
app.get("/{*splat}", (req, res) => {
	res.sendFile(path.join(__dirname, "../../dist", "index.html")) // or 'build'
})

// error handling middleware
// this should be the last middleware
app.use(errorHandler)

app.listen(PORT, () => {
	
	console.log(`Server is running on port ${PORT}`)
})
