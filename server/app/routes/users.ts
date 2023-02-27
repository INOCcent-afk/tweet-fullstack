import express from "express";
import { PrismaClient } from "@prisma/client";

const userRouter = express.Router();
const prisma = new PrismaClient();

userRouter.get("/", async (req, res) => {
	try {
		const tweets = await prisma.tweet.findMany();

		res.status(200).send(tweets);
	} catch (error) {}
});

export default userRouter;
