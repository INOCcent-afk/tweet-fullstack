import { User } from "@prisma/client";
import express from "express";
import { isAuthorized } from "../middlewares/isAuthorized";
import prisma from "../utils/client";
import sentObjectData from "../utils/sentObjectData";

interface RequestBody {
	tweet: string;
	user: User;
}

const tweetRouter = express.Router();

tweetRouter.get("/newsFeed", isAuthorized, async (req, res) => {
	try {
		const { user }: RequestBody = req.body;

		const tweets = await prisma.tweet.findMany({
			where: {
				parentId: null,
				createdBy: {
					id: user.id,
				},
			},
			include: {
				tweets: true,
				likes: true,
				createdBy: {
					select: {
						id: true,
						name: true,
						username: true,
						email: true,
					},
				},
			},
		});

		res.status(200).send(tweets);
	} catch (error) {}
});

tweetRouter.get("/:id", isAuthorized, async (req, res) => {
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

tweetRouter.post("/", isAuthorized, async (req, res) => {
	try {
		const { tweet, user }: RequestBody = req.body;

		const createdTweet = await prisma.tweet.create({
			data: {
				tweet: tweet,
				createdBy: {
					connect: {
						id: user.id,
					},
				},
			},
		});

		res.status(201).send(sentObjectData(true, createdTweet));
	} catch (error) {
		console.log(error);
		res.status(400).send(
			sentObjectData(false, {
				message: "Failed to create tweet",
			})
		);
	}
});

tweetRouter.post("/reply/:id", isAuthorized, async (req, res) => {
	try {
		const { id } = req.params;
		const { tweet, user }: RequestBody = req.body;

		const createdTweet = await prisma.tweet.create({
			data: {
				tweet: tweet,
				parentId: Number(id),
				createdBy: {
					connect: {
						id: user.id,
					},
				},
			},
		});

		if (createdTweet) {
			const getTweets = await prisma.tweet.findUnique({
				where: {
					id: Number(id),
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
						id: Number(id),
					},
					data: {
						tweets: {
							set: [...getTweets.tweets, { id: createdTweet.id }],
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

tweetRouter.post("/retweet/:id", isAuthorized, async (req, res) => {
	try {
		const { id } = req.params;
		const { tweet, user }: RequestBody = req.body;

		const createdTweet = await prisma.tweet.create({
			data: {
				tweet: tweet,
				retweetId: Number(id),
				createdBy: {
					connect: {
						id: user.id,
					},
				},
			},
		});

		if (createdTweet) {
			const reTweet = await prisma.tweet.update({
				where: {
					id: Number(id),
				},

				data: {
					retweetCount: {
						increment: 1,
					},
				},
			});

			if (reTweet)
				res.status(201).send(sentObjectData(true, createdTweet));
		}
	} catch (error) {
		console.log(error);
		res.status(400).send(
			sentObjectData(false, {
				message: "Failed to create tweet",
			})
		);
	}
});

tweetRouter.post("/like/:id", isAuthorized, async (req, res) => {
	try {
		const { id } = req.params;
		const { user }: RequestBody = req.body;

		const tweet = await prisma.tweet.findUnique({
			where: {
				id: Number(id),
			},
			select: {
				likes: {
					where: {
						userId: user.id,
					},
				},
			},
		});

		const isAlreadyLiked = Boolean(tweet) && tweet?.likes.length !== 0;

		if (isAlreadyLiked) {
			// It Should never go here
			return res.status(400).send(
				sentObjectData(false, {
					message: "Tweet is already liked",
				})
			);
		}

		const createdLike = await prisma.like.create({
			data: {
				tweets: {
					connect: {
						id: Number(id),
					},
				},
				createdBy: {
					connect: {
						id: user.id,
					},
				},
			},
		});

		res.status(201).send(sentObjectData(true, createdLike));
	} catch (error) {
		console.log(error);
		res.status(400).send(
			sentObjectData(false, {
				message: "Failed to like tweet",
			})
		);
	}
});

tweetRouter.delete("/unlike/:id", isAuthorized, async (req, res) => {
	try {
		const { id } = req.params;
		const { user }: RequestBody = req.body;

		const tweet = await prisma.tweet.findFirst({
			where: {
				id: Number(id),
			},
			select: {
				likes: {
					where: {
						userId: user.id,
					},
				},
			},
		});

		const isAlreadyUnliked = Boolean(tweet) && tweet?.likes.length === 0;

		if (isAlreadyUnliked) {
			// It Should never go here
			return res.status(400).send(
				sentObjectData(false, {
					message: "tweet is already unliked",
				})
			);
		}

		const deleteLike = await prisma.like.delete({
			where: {
				id: tweet?.likes[0].id,
			},
		});

		res.status(200).send(sentObjectData(true, deleteLike));
	} catch (error) {
		res.status(400).send(
			sentObjectData(false, {
				message: "Failed to unlike tweet",
			})
		);
	}
});

export default tweetRouter;
