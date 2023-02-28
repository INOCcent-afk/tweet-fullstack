import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import config from "./utils/config";
import userRouter from "./routes/users";
import tweetRouter from "./routes/tweets";

(async () => {
	const app = express();
	const router = express.Router();

	// Middlewares
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());
	app.use(express.json());
	app.use(cookieParser());
	app.use(
		cors({
			origin: config.clientUrl,
			methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
			credentials: true,
		})
	);
	app.use(function (req, res, next) {
		res.header("Content-Type", "application/json;charset=UTF-8");
		res.header("Access-Control-Allow-Credentials", "true");
		res.header(
			"Access-Control-Allow-Headers",
			"Origin, X-Requested-With, Content-Type, Accept"
		);
		next();
	});

	// Routers
	router.use("/user", userRouter);
	router.use("/tweet", tweetRouter);
	app.use("/api/v1", router); // Default starting url

	app.get("/", (req, res) => {
		res.send("WELCOME TO TWITTER API");
	});

	const PORT = process.env.PORT || 8000;

	const server = app.listen(PORT, () =>
		console.log(`Server started at ${PORT}`)
	);
})();
