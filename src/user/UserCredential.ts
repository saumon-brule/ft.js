import { fetchRefreshUserToken } from "~/api/oauth/token";
import { UserTokenData } from "~/structures/FtTokenData";
import { OAuth2ClientConfig } from "~/structures/OAuth2ClientConfig";

export class UserCredential {
	private _tokenData: UserTokenData | null;
	oauthConfig: OAuth2ClientConfig;

	private _refreshPromise: Promise<void> | null = null;

	constructor(tokenDataInit: UserTokenData, oauthConfig: OAuth2ClientConfig) {
		this._tokenData = tokenDataInit;
		this.oauthConfig = oauthConfig;
	}

	private _getSecureTokenData<T extends keyof UserTokenData>(dataName: T): UserTokenData[T] {
		if (!this._tokenData) throw new Error("Invalid token: Token is invalid, try to get a new one");
		return this._tokenData[dataName];
	}

	get token(): string { return this._getSecureTokenData("access_token"); }
	get refreshToken(): string { return this._getSecureTokenData("refresh_token"); }
	get type(): string { return this._getSecureTokenData("token_type"); }
	get expiresIn(): number { return this._getSecureTokenData("expires_in"); }
	get createdAt(): number { return this._getSecureTokenData("created_at"); }
	get expiresAt(): number { return this._getSecureTokenData("created_at") + this._getSecureTokenData("expires_in"); }
	get scope(): string { return this._getSecureTokenData("scope"); }
	get secretValidUntil(): number { return this._getSecureTokenData("secret_valid_until"); }

	async requestNewToken() {
		if (this._refreshPromise) return this._refreshPromise;

		this._refreshPromise = new Promise(async (resolve, reject) => {
			try {
				const tokenData = await fetchRefreshUserToken(this.refreshToken, this.oauthConfig);
				this._tokenData = tokenData;
				resolve();
			} catch (error) {
				this._tokenData = null;
				reject(error);
			} finally {
				this._refreshPromise = null;
			}
		});

		return this._refreshPromise;
	}

	get isValid() {
		return Date.now() < this.expiresAt;
	}

	async ensureTokenValidity() {
		if (!this.isValid)
			await this.requestNewToken();
	}

	async getAccessToken() {
		await this.ensureTokenValidity();
		return this.token;
	}
}
