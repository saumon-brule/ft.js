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

	private get _data(): UserTokenData {
		if (!this._tokenData) throw new Error("Invalid token: Token is invalid, try to get a new one");
		return this._tokenData;
	}

	get token(): string { return this._data.access_token; }
	get refreshToken(): string { return this._data.refresh_token; }
	get type(): string { return this._data.token_type; }
	get expiresIn(): number { return this._data.expires_in; }
	get createdAt(): number { return this._data.created_at; }
	get scope(): string { return this._data.scope; }
	get secretValidUntil(): number { return this._data.secret_valid_until; }
	get expiresAt(): number {
		const data = this._data;
		return data.created_at + data.expires_in;
	}

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
