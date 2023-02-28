import express from "express";
import prisma from "../utils/client";
import sentObjectData from "../utils/sentObjectData";

const tweetRouter = express.Router();

tweetRouter.get("/newsFeed", async (req, res) => {
	try {
		const tweets = await prisma.tweet.findMany({
			where: {},
			include: {
				tweets: true,
				likes: true,
				createdBy: true,
			},
		});

		res.status(200).send(tweets);
	} catch (error) {}
});

tweetRouter.get("/:id", async (req, res) => {
	try {
		const { id } = req.params;

		const post = await prisma.tweet.findUnique({
			where: { id: Number(id) },
		});

		res.status(200).send(sentObjectData(false, post));
	} catch (error) {
		res.status(404).send(
			sentObjectData(false, { message: "Tweet Not Found" })
		);
	}
});

tweetRouter.post("/", async (req, res) => {
	try {
		const {} = req.body;

		const tweet = await prisma.tweet.create({
			data: {
				tweet: "Hi",
				createdBy: {
					connect: {
						id: 1,
					},
				},
			},
		});

		res.status(201).send(sentObjectData(true, tweet));
	} catch (error) {
		console.log(error);
		res.status(400).send(
			sentObjectData(false, {
				message: "Failed to create tweet",
			})
		);
	}
});

tweetRouter.post("/reply", async (req, res) => {
	try {
		const {} = req.body;

		const id = 13;

		const tweet = await prisma.tweet.create({
			data: {
				tweet: "Hi Number 13!!!",
				parentId: id,
				createdBy: {
					connect: {
						id: 1,
					},
				},
			},
		});

		if (tweet) {
			const getTweets = await prisma.tweet.findUnique({
				where: {
					id: id,
				},
				select: {
					tweets: {
						select: {
							id: true,
						},
					},
				},
			});

			if (getTweets) {
				const repliedTo = await prisma.tweet.update({
					where: {
						id: id,
					},
					data: {
						tweets: {
							set: [...getTweets.tweets, { id: tweet.id }],
						},
					},
					include: {
						tweets: true,
						likes: true,
						createdBy: true,
					},
				});

				res.status(201).send(sentObjectData(true, repliedTo));
			}
		}
	} catch (error) {
		res.status(400).send(
			sentObjectData(false, {
				message: "Failed to create tweet",
			})
		);
	}
});

export default tweetRouter;
