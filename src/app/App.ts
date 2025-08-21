import { AppCredentialsManager } from "./TokenManager/AppCredentialsManager";
import { UserManager } from "./UserManager/UserManager";
import { OAuth2Credentials } from "~/structures/OAuth2Credentials";
import EventEmitter from "events";
import { FtEvent } from "~/structures/Events";
import { AppHttpClient } from "./client/AppHttpClient";
import { ApiRoute } from "~/structures/ApiRoute";

export class FtApp extends EventEmitter<FtEvent> {
	credentialsManager: AppCredentialsManager;
	userManager: UserManager;
	httpClient: AppHttpClient;

	constructor(oauth2CredentialsList: OAuth2Credentials[]) {
		super();
		this.credentialsManager = new AppCredentialsManager(oauth2CredentialsList);
		this.userManager = new UserManager(this);
		this.httpClient = new AppHttpClient(this);
	}

	get(route: ApiRoute, options?: RequestInit) {
		return this.httpClient.get(route, options);
	}

	post(route: ApiRoute, options: RequestInit) {
		return this.httpClient.post(route, options);
	}
}
