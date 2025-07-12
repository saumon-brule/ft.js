import { BaseClient } from "~/client/BaseClient";
import { AppTokenManager } from "./TokenManager/AppTokenManager";
import { AppCredentials } from "~/structures/AppCredentials";



export class FtApp extends BaseClient {
	tokenHandler: AppTokenManager;

	constructor(AppCredentialsList: AppCredentials[], ) {
		super();
		this.tokenHandler = new AppTokenManager(AppCredentialsList);
	}

	get token() {
		return this.tokenHandler.token;
	}

	async login(): Promise<void> {
		return this.tokenHandler.init()
	}
}
