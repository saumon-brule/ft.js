import { AppCredential } from "./AppCredential";
import { OAuth2ClientConfig } from "~/structures/OAuth2ClientConfig";

/*
missing :
in the method `token` it would be great if a token isn't available, to get another one while its being fetched
a way to refresh every possible token

*/
export class AppCredentialsManager {
	appCredentials: AppCredential[];
	private activeAppTokenIndex: number = 0;

	constructor(configs: OAuth2ClientConfig[]) {
		this.appCredentials = configs.map((config) => {
			return new AppCredential(config);
		});
	}

	private shift(offset: number = 1) {
		this.activeAppTokenIndex = (this.activeAppTokenIndex + offset) % this.appCredentials.length;
	}

	activeToken(): string | null {
		return this.appCredentials[this.activeAppTokenIndex].token;
	}

	get config() {
		const credentials = this.appCredentials[this.activeAppTokenIndex].oauthConfig;
		this.shift();
		return credentials;
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
