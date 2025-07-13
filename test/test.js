import { configDotenv } from "dotenv";
configDotenv({ quiet: true });

process.on("uncaughtException", ({ message }) => {
	console.log("Error: " + message);
});

import { FtApp } from "../dist/index.js";

const App = new FtApp([
	{ uid: process.env.APP_UID, secret: process.env.APP_SECRET, redirectURI: "http://localhost:3042/callback" },
	{ uid: process.env.APP_UID2, secret: process.env.APP_SECRET2, redirectURI: "http://localhost:3042/callback" },
]);

console.log(App);

await App.login();

App.userManager.startAuthServer();
console.log("test");
