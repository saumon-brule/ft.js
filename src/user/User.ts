import { UserTokenData } from "~/api/oauth/token";
import { FtApp } from "~/app/App";
import { AppCredential } from "~/app/TokenManager/AppCredential";
import { UserToken } from "./UserToken";

export class User {
	ftApp: FtApp;
	userToken: UserToken;
	token: string | null = null;
	constructor (ftApp: FtApp, userTokenData: UserTokenData, appCredential: AppCredential) {
		this.ftApp = ftApp;
		this.userToken = new UserToken(userTokenData, appCredential);
	}
}