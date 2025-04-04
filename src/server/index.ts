import express from "express"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import cors from "cors"
import { log } from "./middleware/01.log"
import { authentication } from "./middleware/02.authentication"
import { authorization } from "./middleware/03.authorization"
import { PrismaClient } from "@prisma/client"
import router from "./routes/routes.ts"

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

const replaceParams = (string) => {
	let curr = string
	let last = ""
	let paramCount = 1
	while (last !== curr) {
		last = curr.slice()
		// this is the pattern that express uses when you define your path param without a custom regex
		curr = curr.replace("(?:([^\\/]+?))", `:param${paramCount++}`)
	}
	return curr
}

const fetchRoutes = (initialRouter) => {
	const _fetchRoutes = (router, prefix = "") => {
		const routes = []
		router.stack.forEach(({ route, handle, name, ...rest }) => {
			if (route) {
				// routes registered directly on the app
				const path = replaceParams(`${prefix}${route.path}`).replace(/\\/g, "")
				routes.push({ path, methods: route.methods })
			} else if (name === "router") {
				// router middleware
				const newPrefix = rest.regexp.source
					.replace("\\/?(?=\\/|$)", "") // this is the pattern express puts at the end of a route path
					.slice(1)
					.replace("\\", "") // remove escaping to make paths more readable
				routes.push(..._fetchRoutes(handle, prefix + newPrefix))
			}
		})
		return routes
	}
	return _fetchRoutes(initialRouter)
}

app.listen(PORT, () => {
	console.log(`Server is running on ${BASE_URL}`)
	console.log("All available routes:")
	console.log(fetchRoutes(app._router))
})
