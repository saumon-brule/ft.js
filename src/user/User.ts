import { FtApp } from "~/app/App";
import { UserCredential } from "./UserCredential";
import { UserHttpClient } from "~/app/client/UserHttpClient";
import { fetchMe } from "~/api/me";
import { OAuth2ClientConfig } from "~/structures/OAuth2ClientConfig";
import { UserTokenData } from "~/structures/FtTokenData";
import { ApiRoute } from "~/structures/ApiRoute";


export class User {
	id: number;
	ftApp: FtApp;
	credentials: UserCredential;
	httpClient: UserHttpClient;

	private constructor(ftApp: FtApp, credentials: UserCredential, data: any) {
		this.ftApp = ftApp;
		this.credentials = credentials;
		this.httpClient = new UserHttpClient(this);
		this.id = data.id;
	}

	static async create(ftApp: FtApp, userTokenData: UserTokenData, oauthConfig: OAuth2ClientConfig) {
		const credentials = new UserCredential(userTokenData, oauthConfig);
		const data = await fetchMe(await credentials.getAccessToken());
		if (!data.id) throw new Error("No user id after fetch");
		return new User(ftApp, credentials, data);
	}

	get(route: ApiRoute, options?: RequestInit) {
		return this.httpClient.get(route, options);
	}

	post(route: ApiRoute, options: RequestInit) {
		return this.httpClient.post(route, options);
	}
}
