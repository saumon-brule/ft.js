import { FtApp } from "~/app/App";
import { UserCredential } from "./UserCredential";
import { UserHttpClient } from "~/app/client/UserHttpClient";
import { fetchMe } from "~/api/me";
import { OAuth2ClientConfig } from "~/structures/OAuth2ClientConfig";
import { UserTokenData } from "~/structures/FtTokenData";

export class User {
	id: number | null = null;
	ftApp: FtApp;
	credentials: UserCredential;
	httpClient: UserHttpClient;

	constructor (ftApp: FtApp, userTokenData: UserTokenData, oauthConfig: OAuth2ClientConfig) {
		this.ftApp = ftApp;
		this.credentials = new UserCredential(userTokenData, oauthConfig);
		this.httpClient = new UserHttpClient(this);
	}

	async load() {
		const data = await fetchMe(this.credentials.token);
		if (!data.id) throw new Error("No user id after fetch");
		this.id = data.id;
	}
}
