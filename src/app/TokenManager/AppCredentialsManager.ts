import { AppCredentials } from "./AppCredentials";
import { OAuth2ClientConfig } from "~/structures/OAuth2ClientConfig";

/*
missing :
in the method `token` it would be great if a token isn't available, to get another one while its being fetched
a way to refresh every possible token

*/
export class AppCredentialsManager {
	appCredentialsList: AppCredentials[];
	private activeAppTokenIndex: number = 0;

	constructor(configs: OAuth2ClientConfig[]) {
		this.appCredentialsList = configs.map((config) => {
			return new AppCredentials(config);
		});
	}

	private shift(offset: number = 1) {
		this.activeAppTokenIndex = (this.activeAppTokenIndex + offset) % this.appCredentialsList.length;
	}

	activeToken(): string | null {
		return this.appCredentialsList[this.activeAppTokenIndex].token;
	}

	get config() {
		const oauthConfig = this.appCredentialsList[this.activeAppTokenIndex].oauthConfig;
		this.shift();
		return oauthConfig;
	}

	get token() {
		const startIndex = this.activeAppTokenIndex;
		do {
			const token = this.activeToken();
			this.shift();
			if (token)
				return token;
		} while (startIndex != this.activeAppTokenIndex);
		return null;
	}
}
