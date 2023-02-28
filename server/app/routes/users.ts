import express, { NextFunction, Request, Response } from "express";
import prisma from "../utils/client";
import sentObjectData from "../utils/sentObjectData";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../utils/config";
import { User } from "@prisma/client";
import { isAuthorized } from "../middlewares/isAuthorized";

const userRouter = express.Router();

userRouter.get("/", async (req, res) => {});

userRouter.post("/register", async (req, res) => {
	try {
		const { email, name, username, password } = req.body;

		if (!(email && password && name && username)) {
			res.status(400).send("All input is required");
		}

		const oldUser = await prisma.user.findUnique({
			where: {
				email: email,
			},
		});

		if (oldUser)
			return res.status(400).send("User Already Exists. Please login");

		const encryptedPassword = await bcrypt.hash(password, 10);

		const user = await prisma.user.create({
			data: {
				email: email,
				name: name,
				username: username,
				password: encryptedPassword,
			},
			select: {
				email: true,
				name: true,
				username: true,
				id: true,
			},
		});

		const token = jwt.sign(
			{
				id: user.id,
				email: user.email,
				name: user.name,
				username: user.username,
			},
			config.jwtSecret as string,
			{ expiresIn: "2h" }
		);

		res.cookie("sessionId", token, { httpOnly: true });
		res.status(201).send(sentObjectData(true, user));
	} catch (error) {
		console.log(error);
		res.status(400).send(
			sentObjectData(false, {
				message: "Failed to create user",
			})
		);
	}
});

userRouter.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!(email && password)) {
			res.status(400).send("All input is required");
		}

		const user = await prisma.user.findUnique({
			where: {
				email: email,
			},
		});

		if (user && (await bcrypt.compare(password, user.password))) {
			const token = jwt.sign(
				{
					id: user.id,
					email: user.email,
					name: user.name,
					username: user.username,
				},
				config.jwtSecret as string,
				{ expiresIn: "2h" }
			);

			res.cookie("sessionId", token, { httpOnly: true });

			const sanitizedUserData = (({ password, ...restObject }: User) =>
				restObject)(user);

			res.send(sentObjectData(true, sanitizedUserData));
		} else {
			res.status(401).send(
				sentObjectData(false, { message: "Invalid login credentials" })
			);
		}
	} catch (error) {
		res.status(400).send(
			sentObjectData(false, {
				message: "Failed to create user",
			})
		);
	}
});

userRouter.post("/logout", async (req, res) => {
	try {
		res.clearCookie("sessionId");

		return res
			.status(200)
			.send(sentObjectData(true, { message: "Logout successfully" }));
	} catch (error) {
		res.status(400).send(
			sentObjectData(false, {
				message: "Failed to logout",
			})
		);
	}
});

// Verify user authentication
userRouter.get("/protected", isAuthorized, async (req, res) => {
	try {
		res.status(200).send(sentObjectData(false, req.body));
	} catch (error) {}
});

export default userRouter;
