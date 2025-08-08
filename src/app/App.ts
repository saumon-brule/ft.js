import { AppCredentialsManager } from "./TokenManager/AppCredentialsManager";
import { UserManager } from "./UserManager/UserManager";
import { OAuth2ClientConfig } from "~/structures/OAuth2ClientConfig";
import EventEmitter from "events";
import { FtEvent } from "~/structures/Events";
import { AppHttpClient } from "./client/AppHttpClient";
import { ApiRoute } from "~/structures/ApiRoute";

export class FtApp extends EventEmitter<FtEvent> {
	credentialsManager: AppCredentialsManager;
	userManager: UserManager;
	httpClient: AppHttpClient;

	constructor(configs: OAuth2ClientConfig[]) {
		super();
		this.credentialsManager = new AppCredentialsManager(configs);
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
