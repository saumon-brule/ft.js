import { AppCredential } from "./AppCredential";
import { OAuth2ClientConfig } from "~/structures/OAuth2ClientConfig";

export class AppCredentialsManager {
	appCredentials: AppCredential[] = [];
	private activeAppTokenIndex: number = 0;

	constructor(configs: OAuth2ClientConfig[]) {
		configs.forEach((config) => {
			this.appCredentials.push(new AppCredential(config));
		});
	}

	async init() {
		if (this.appCredentials.length === 0) {
			throw new Error("No App credentials found");
		}
		const promises: Promise<void>[] = [];
		this.appCredentials.forEach((token) => {
			promises.push(token.refresh());
		});
		await Promise.all(promises);
	}

	shift(offset?: number) {
		this.activeAppTokenIndex = (this.activeAppTokenIndex + (offset ?? 1)) % this.appCredentials.length;
	}

	active(): string | null {
		return this.appCredentials[this.activeAppTokenIndex].token;
	}

	get config() {
		const credentials = this.appCredentials[this.activeAppTokenIndex].appConfig;
		this.shift();
		return credentials;
	}

	get token() {
		const startIndex = this.activeAppTokenIndex;
		do {
			const token = this.active();
			this.shift();
			if (token)
				return token;
		} while (startIndex != this.activeAppTokenIndex);
		return null;
	}
}
