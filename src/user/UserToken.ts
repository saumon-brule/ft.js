import { copyFileSync } from "fs";
import { fetchRefreshUserToken } from "~/api/oauth/token";
import { UserTokenData } from "~/structures/FtTokenData";
import { AppCredential } from "~/app/TokenManager/AppCredential";

export class UserToken {
	token: string;
	refreshToken: string;
	type: string;
	scope: string;
	createdAt: number;
	expiresIn: number;
	expiresAt: number;
	appCredential: AppCredential;

	constructor(userTokenData: UserTokenData, appCredential: AppCredential) {
		this.token = userTokenData.access_token;
		this.refreshToken = userTokenData.refresh_token;
		this.type = userTokenData.token_type;
		this.scope = userTokenData.scope;
		this.createdAt = userTokenData.created_at;
		this.expiresIn = userTokenData.expires_in;
		this.expiresAt = userTokenData.created_at + userTokenData.expires_in;
		this.appCredential = appCredential;
	}

	async refresh() {
		const userTokenData = await fetchRefreshUserToken(this.refreshToken, this.appCredential.appConfig);
		this.token = userTokenData.access_token;
		this.refreshToken = userTokenData.refresh_token;
		this.type = userTokenData.token_type;
		this.scope = userTokenData.scope;
		this.createdAt = userTokenData.created_at;
		this.expiresAt = Date.now() + userTokenData.expires_in;
	}

	async ensureValidity() {
		if (Date.now() >= this.expiresAt)
			await this.refresh();
	}
}
