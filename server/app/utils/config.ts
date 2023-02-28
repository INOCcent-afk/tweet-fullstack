import { config as dotenvConfig } from "dotenv";
dotenvConfig();

const config = {
	clientUrl: process.env.CLIENT_URL,
	databaseUrl: process.env.DATABASE_URL,
	jwtSecret: process.env.SECRET,
};

export default config;
