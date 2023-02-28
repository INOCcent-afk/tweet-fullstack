import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../utils/config";
import sentObjectData from "../utils/sentObjectData";

export const isAuthorized = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const sessionId = req.cookies.sessionId;

		jwt.verify(
			sessionId,
			config.jwtSecret as string,
			(err: any, data: any) => {
				if (err) {
					res.status(401).send(
						sentObjectData(false, { message: "Unauthorized" })
					);
				} else if (data.id) {
					// @ts-ignore
					req.body.user = data;
					next();
				}
			}
		);
	} catch (error) {
		res.status(401).send(
			sentObjectData(false, { message: "Unauthorized" })
		);
	}
};
