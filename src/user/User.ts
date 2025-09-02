import { FtApp } from "~/app/App";
import { UserCredential } from "./UserCredential";
import { UserHttpClient } from "~/user/UserHttpClient";
import { fetchMe } from "~/api/me";
import { OAuth2Credentials } from "~/generic/credentials/OAuth2Credentials";
import { UserTokenData } from "~/api/oauth/token.schema";
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

	static async create(ftApp: FtApp, userTokenData: UserTokenData, oauth2Credentials: OAuth2Credentials) {
		const credentials = new UserCredential(userTokenData, oauth2Credentials);
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
