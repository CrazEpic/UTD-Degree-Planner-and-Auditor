import { Request, Response, NextFunction } from "express"

export const authorization = (req: Request, res: Response, next: NextFunction) => {
	next()
}
