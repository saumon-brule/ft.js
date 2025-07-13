import { User } from "~/user/User";
import { OAuth2Server, OAuth2ServerOptions } from "~/server/OAuth2Server";
import { UserTokenData } from "~/api/oauth/token";
import { FtApp } from "../App";
import { AppCredential } from "../TokenManager/AppCredential";

export class UserManager {
	users: User[] = [];
	server: OAuth2Server;
	ftApp: FtApp;

	constructor(ftApp: FtApp) {
		this.ftApp = ftApp;
		this.server = new OAuth2Server(ftApp, this);
	}

	registerUser(userTokenData: UserTokenData, appCredential: AppCredential) {
		const user = new User(this.ftApp, userTokenData, appCredential);
		console.log(userTokenData.access_token);
		console.log(userTokenData.created_at);
		console.log(userTokenData.expires_in);
		console.log(userTokenData.scope);
		console.log(userTokenData.secret_valid_until);
		console.log(userTokenData.token_type);
	}

	startAuthServer(options: OAuth2ServerOptions = {
		hostname: "localhost",
		port: 3042,
		loginRoute: "/",
		callbackRoute: "/callback",
		successPage: "/home/saumon/dev/perso/ft-js/web/success.html",
		errorPage: "/home/saumon/dev/perso/ft-js/web/error.html"
	}) {
		this.server.start(options);
	}
}
