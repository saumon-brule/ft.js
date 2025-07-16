import { configDotenv } from "dotenv";
configDotenv({ quiet: true });
import { FtApp } from "../dist/index.js";

process.on("uncaughtException", ({ message }) => {
	console.error("Error: " + message);
});

const App = new FtApp([
	{ uid: process.env.APP_UID, secret: process.env.APP_SECRET, redirectURI: "http://localhost:3042/callback" }
]);

await App.login();

global.app = App;

App.events.on("userAdd", (user) => {
	console.log(user.userToken.createdAt);
	console.log(user.userToken.expiresIn);
	console.log(user.userToken.expiresAt);
});

App.events.on("serverOn", (server) => {
	console.log("Server ON");
});

App.startAuthServer();
