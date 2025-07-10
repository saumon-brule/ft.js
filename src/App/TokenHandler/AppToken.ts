import { getAppToken } from "~/api/oauth/token";
import AppTokenReponse from "~/structures/AppTokenReponse";
import { AppCredentials } from "~/structures/AppCredentials";

export default class AppToken {
	private appCredentials: AppCredentials;
	private tokenValue: string|null = null;

	constructor(appCredentials: AppCredentials) {
		this.appCredentials = { ...appCredentials };
		this.refreshAppToken();
	}

	async refreshAppToken() {
		const appTokenResponse: AppTokenReponse = await getAppToken(this.appCredentials.uid, this.appCredentials.secret);
		console.log(appTokenResponse);
		this.tokenValue = appTokenResponse.access_token;
	}

	get token(): string|null {
		return this.tokenValue;
	}
}