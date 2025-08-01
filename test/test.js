import { configDotenv } from "dotenv";
configDotenv({ quiet: true });
import { AuthenticatedRequest, FtApp } from "../dist/index.js";
import express from "express";
import jwt from "jsonwebtoken";

process.on("uncaughtException", (error) => {
	console.trace(error);
});

const App = new FtApp([
	{ uid: process.env.APP_UID, secret: process.env.APP_SECRET, redirectURI: "http://localhost:3042/callback" }
]);

async function getAllUsers() {
	App.httpClient.get("/v2/campus/9/users?filter[pool_year]=2024,2023")
		.then((response) => response.json())
		.then((data) => {
			console.log(data);
		});
}

getAllUsers();

const app = express();

app.get("/", App.userManager.authenticate());

app.get("/error", (_, res) => {
	res.send("Authentification error");
});

app.get("/success", (_, res) => {
	res.send("Authentification success");
});

app.get("/callback",
	App.userManager.callback({ errorPage: "/error" }),
	(req, res) => {
		console.log(process.env.JWT_SECRET);
		const userJwt = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
		console.log(jwt.verify(userJwt, process.env.JWT_SECRET));
		res.cookie("ft_people_token", userJwt, {
			httpOnly: true,
			secure: true,
			sameSite: "strict",
			maxAge: 1000 * 60 * 60
		});
		res.redirect("/success");
	}
);

app.listen(parseInt(process.env.PORT), process.env.HOST, () => console.log("http://localhost:3042"));
