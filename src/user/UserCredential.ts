import { UserTokenData } from "~/api/oauth/token.schema";
import { OAuth2Credentials } from "~/generic/credentials/OAuth2Credentials";

export class UserCredential {
	private _tokenData: UserTokenData | null;
	oauth2Credentials: OAuth2Credentials;

	private _refreshPromise: Promise<void> | null = null;

	constructor(tokenDataInit: UserTokenData, oauth2Credentials: OAuth2Credentials) {
		this._tokenData = tokenDataInit;
		this.oauth2Credentials = oauth2Credentials;
	}

	private get _data(): UserTokenData {
		if (!this._tokenData) throw new Error("Invalid token: Token is invalid, try to get a new one");
		return this._tokenData;
	}

	get token(): string { return this._data.token; }
	get type(): string { return this._data.type; }
	get scope(): string { return this._data.scope; }
	get expiresIn(): number { return this._data.expiresIn; }
	get createdAt(): number { return this._data.createdAt; }
	get expiresAt(): number { return this._data.expiresAt; }
	get refreshToken(): string { return this._data.refreshToken; }
	get secretValidUntil(): number { return this._data.secretValidUntil; }

	async requestNewToken() {
		if (this._refreshPromise) return this._refreshPromise;

		this._refreshPromise = new Promise(async (resolve, reject) => {
			try {
				this._tokenData = await this.oauth2Credentials.requestRefreshUserToken(this.refreshToken);
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
