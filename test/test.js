import { configDotenv } from "dotenv";
configDotenv({ quiet: true });

process.on("uncaughtException", ({ message }) => {
	console.log("Error: " + message);
});

import { FtApp } from "../dist/index.js";

const App = new FtApp({ uid: process.env.APP_UID, secret: process.env.APP_SECRET });

console.log(App);
