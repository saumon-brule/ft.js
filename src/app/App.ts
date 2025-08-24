import { AppCredentialsManager } from "./credentials/AppCredentialsManager";
import { UserManager } from "./UserManager/UserManager";
import EventEmitter from "events";
import { FtEvent } from "~/structures/Events";
import { AppHttpClient } from "./client/AppHttpClient";
import { ApiRoute } from "~/structures/ApiRoute";
import { FtConfig, FtConfigProps } from "./configs/FtConfigs";
import { OAuth2CredentialsProps } from "~/structures/OAuth2CredentialsProps";

export class FtApp extends EventEmitter<FtEvent> {
	configs: FtConfig;
	credentialsManager: AppCredentialsManager;
	userManager: UserManager;
	httpClient: AppHttpClient;

	constructor(oauth2CredentialsPropsList: OAuth2CredentialsProps[], ftConfigProps?: FtConfigProps) {
		super();
		this.configs = new FtConfig(ftConfigProps);
		this.credentialsManager = new AppCredentialsManager(oauth2CredentialsPropsList, this);
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
