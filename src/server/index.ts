import express from "express"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import cors from "cors"
import { log } from "./middleware/01.log"
import { authentication } from "./middleware/02.authentication"
import { authorization } from "./middleware/03.authorization"
import { PrismaClient } from "@prisma/client"
import router from "./routes/testRoute"

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

const app = express()
const PORT = process.env.PORT
const BASE_URL = process.env.BASE_URL

const prisma = new PrismaClient()

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

app.listen(PORT, () => {
	console.log(`Server is running on ${BASE_URL}`)
})
