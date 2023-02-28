import express from "express";
import prisma from "../utils/client";
import sentObjectData from "../utils/sentObjectData";

const userRouter = express.Router();

userRouter.get("/", async (req, res) => {});

userRouter.post("/", async (req, res) => {
	try {
		const {} = req.body;

		const user = await prisma.user.create({
			data: {
				email: "michael828inoc@gmail.com",
				name: "dave inoc",
				username: "daveinoc",
				password: "daveinoc",
			},
		});

		res.status(201).send(sentObjectData(true, user));
	} catch (error) {
		res.status(400).send(
			sentObjectData(false, {
				message: "Failed to create user",
			})
		);
	}
});

export default userRouter;
