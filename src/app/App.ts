import { AppCredentialsManager } from "./TokenManager/AppCredentialsManager";
import { UserManager } from "./UserManager/UserManager";
import EventEmitter from "events";
import { FtEvent } from "~/structures/Events";
import { AppHttpClient } from "./client/AppHttpClient";
import { ApiRoute } from "~/structures/ApiRoute";
import { FtConfig } from "./configs/FtConfigs";
import { OAuth2CredentialsParams } from "~/structures/OAuth2CredentialsParams";

export class FtApp extends EventEmitter<FtEvent> {
	configs: FtConfig = new FtConfig();
	credentialsManager: AppCredentialsManager;
	userManager: UserManager;
	httpClient: AppHttpClient;

	constructor(oauth2CredentialsParamsList: OAuth2CredentialsParams[]) {
		super();
		this.credentialsManager = new AppCredentialsManager(oauth2CredentialsParamsList, this);
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
