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

App.httpClient.get("/v2/campus?per_page=100")
	.then(response => response.json())
	.then(console.log);

App.events.on("userAdd", (user) => {
	user.load().then(console.log);
});

App.events.on("serverOn", (server) => {
	console.log("Server ON");
});

App.startAuthServer();
