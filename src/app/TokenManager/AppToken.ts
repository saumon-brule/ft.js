import { getAppToken } from "~/api/oauth/token";
import { AppCredentials } from "~/structures/AppCredentials";

type TokenState = "pending" | "valid" | "invalid"

export class AppToken {
	private appCredentials: AppCredentials;
	private tokenValue: string | null = null;
	private state: TokenState = "invalid";

	constructor(appCredentials: AppCredentials) {
		this.appCredentials = { ...appCredentials };
	}

	async refresh(): Promise<void> {
		this.state = "pending";
		try {
			const appTokenResponse = await getAppToken(this.appCredentials.uid, this.appCredentials.secret);
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