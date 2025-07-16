import { fetchAppToken } from "~/api/oauth/token";
import { OAuth2ClientConfig } from "~/structures/OAuth2ClientConfig";

type TokenState = "pending" | "valid" | "invalid"

export class AppCredential {
	appConfig: OAuth2ClientConfig;
	private tokenValue: string | null = null;
	private state: TokenState = "invalid";

	constructor(appConfig: OAuth2ClientConfig) {
		this.appConfig = { ...appConfig };
	}

	async refresh(): Promise<void> {
		this.state = "pending";
		try {
			const appTokenResponse = await fetchAppToken(this.appConfig.uid, this.appConfig.secret);
			this.tokenValue = appTokenResponse.access_token;
			this.state = "valid";
		} catch (error) {
			this.state = "invalid";
			throw error;
		}
	}

	get token(): string | null {
		if (this.state === "valid") {
			return this.tokenValue;
		}
		return null;
	}
}
