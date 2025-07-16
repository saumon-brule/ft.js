import { UserTokenData } from "~/api/oauth/token";
import { FtApp } from "~/app/App";
import { AppCredential } from "~/app/TokenManager/AppCredential";
import { UserToken } from "./UserToken";
import { UserHttpClient } from "~/app/client/UserHttpClient";
import { fetchMe } from "~/api/me";

export class User {
	ftApp: FtApp;
	userToken: UserToken;
	httpClient: UserHttpClient;

	constructor (ftApp: FtApp, userTokenData: UserTokenData, appCredential: AppCredential) {
		this.ftApp = ftApp;
		this.userToken = new UserToken(userTokenData, appCredential);
		this.httpClient = new UserHttpClient(this);
	}

	async load() {
		return fetchMe(this);
	}
}
