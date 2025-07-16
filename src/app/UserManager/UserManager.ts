import { User } from "~/user/User";
import { OAuth2Server } from "~/app/server/OAuth2Server";
import { UserTokenData } from "~/api/oauth/token";
import { FtApp } from "../App";
import { AppCredential } from "../TokenManager/AppCredential";

export class UserManager {
	users: User[] = [];
	ftApp: FtApp;
	server: OAuth2Server;

	constructor(ftApp: FtApp) {
		this.ftApp = ftApp;
		this.server = new OAuth2Server(ftApp, this);
	}

	registerUser(userTokenData: UserTokenData, appCredential: AppCredential) {
		const user = new User(this.ftApp, userTokenData, appCredential);
		this.users.push(user);
		this.ftApp.events.emit("userAdd", user);
	}
}
