import { configDotenv } from "dotenv";
configDotenv({ quiet: true });
import Ft from "../dist/index.js";
import express from "express";
import jwt from "jsonwebtoken";

process.on("uncaughtException", (error) => {
	console.trace(error);
});

const ft = new Ft([
	{ uid: process.env.APP_UID, secret: process.env.APP_SECRET, redirectURI: "http://localhost:3042/callback" }
]);

ft.configs.setSecretExpirationWarningTime(1000 * 60 * 60 * 24 * 30);

// async function getAllUsers() {
// 	let page = 0;
// 	let len;
// 	do {
// 		await ft.get(`/v2/campus/9/users?filter[pool_year]=>2024&filter[kind]=student&per_page=100&page=${page}`)
// 			.then((response) => response.json())
// 			.then((data) => {
// 				data.forEach(user => {
// 					allUsers.push({ profilePicture: data.image?.link, login: user.login, displayName: user.displayName });
// 				});
// 				len = data.length;
// 			});
// 		page += 1;
// 	} while (len === 100);
// }

// getAllUsers();

// ft.get("/v2/users").then((response) => response.json()).then(console.log);

ft.on("userAdd", (user) => {
	user.get("/v2/me")
		.then((response) => response.json())
		.then((me) => console.log(me.kind));
});

// app is not necessary here because the user already has access to the app (while using ft.on)
ft.on("tokenExpirationWarning", (oauth2Credentials, expiringDate) => {
	console.warn("Warning: secret expiring soon")
});

const app = express();

app.get("/", ft.userManager.authenticate());

app.get("/error", (_, res) => {
	res.send("Authentification error");
});

app.get("/success", (_, res) => {
	res.send("Authentification success");
});

app.get("/callback",
	ft.userManager.callback({ errorPage: "/error" }),
	(req, res) => {
		const userJwt = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
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
