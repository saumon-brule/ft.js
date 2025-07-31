import { fetchAppToken } from "~/api/oauth/token";
import { AppTokenData } from "~/structures/FtTokenData";
import { OAuth2ClientConfig } from "~/structures/OAuth2ClientConfig";

export class AppCredential {
	private _tokenData: AppTokenData | null | undefined = undefined;
	oauthConfig: OAuth2ClientConfig;

	private _refreshPromise: Promise<void> | null = null;

	constructor(oauthConfig: OAuth2ClientConfig) {
		this.oauthConfig = oauthConfig;
		this.requestNewToken();
	}

	private _getSecureTokenData<T extends keyof AppTokenData>(dataName: T): AppTokenData[T] {
		if (this._tokenData === undefined) throw new Error("Uninitalized token: Cannot access data of uninitialized token");
		if (this._tokenData === null) throw new Error("Invalid token: Token is invalid, try to get a new one");
		return this._tokenData[dataName];
	}

	get token(): string { return this._getSecureTokenData("access_token"); }
	get type(): string { return this._getSecureTokenData("token_type"); }
	get expiresIn(): number { return this._getSecureTokenData("expires_in"); }
	get createdAt(): number { return this._getSecureTokenData("created_at"); }
	get expiresAt(): number { return this._getSecureTokenData("created_at") + this._getSecureTokenData("expires_in"); }
	get scope(): string { return this._getSecureTokenData("scope"); }
	get secretValidUntil(): number { return this._getSecureTokenData("created_at"); }

	async requestNewToken() {
		if (this._refreshPromise) return this._refreshPromise;

		this._refreshPromise = new Promise(async (resolve, reject) => {
			try {
				const tokenData = await fetchAppToken(this.oauthConfig.uid, this.oauthConfig.secret);
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

	async ensureTokenValidity() {
		if (Date.now() >= this.expiresAt)
			await this.requestNewToken();
	}
}
