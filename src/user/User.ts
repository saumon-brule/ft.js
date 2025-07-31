import { FtApp } from "~/app/App";
import { AppCredential } from "~/app/TokenManager/AppCredential";
import { UserToken } from "./UserToken";
import { UserHttpClient } from "~/app/client/UserHttpClient";
import { fetchMe } from "~/api/me";
import { UserTokenData } from "~/structures/FtTokenData";

export class User {
	id: number | null = null;
	ftApp: FtApp;
	userToken: UserToken;
	httpClient: UserHttpClient;

	constructor (ftApp: FtApp, userTokenData: UserTokenData, appCredential: AppCredential) {
		this.ftApp = ftApp;
		this.userToken = new UserToken(userTokenData, appCredential);
		this.httpClient = new UserHttpClient(this);
	}

	async load() {
		const data = await fetchMe(this);
		if (!data.id) throw new Error("No User id after fetch");
		this.id = data.id;
	}
}
