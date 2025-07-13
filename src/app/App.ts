import { BaseClient } from "~/client/BaseClient";
import { AppCredentialsManager } from "./TokenManager/AppCredentialsManager";
import { UserManager } from "./UserManager/UserManager";
import { OAuth2ClientConfig } from "~/structures/OAuth2ClientConfig";

export class FtApp extends BaseClient {
	credentialsManager: AppCredentialsManager;
	userManager: UserManager;

	constructor(configs: OAuth2ClientConfig[],) {
		super();
		this.credentialsManager = new AppCredentialsManager(configs);
		this.userManager = new UserManager(this);
	}

	get token() {
		return this.credentialsManager.token;
	}

	async login() {
		return this.credentialsManager.init();
	}
}
