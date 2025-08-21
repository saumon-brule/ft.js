import { fetchAppToken } from "~/api/oauth/token";
import { AppTokenData } from "~/structures/FtTokenData";
import { OAuth2Credentials } from "~/structures/OAuth2Credentials";

export class AppCredentials {
	private _tokenData: AppTokenData | null | undefined = undefined;
	oauth2Credentials: OAuth2Credentials;

	private _refreshPromise: Promise<void> | null = null;

	constructor(oauth2Credentials: OAuth2Credentials) {
		this.oauth2Credentials = oauth2Credentials;
		this.requestNewToken();
	}

	private get _data(): AppTokenData {
		if (this._tokenData === undefined) throw new Error("Uninitalized token: Cannot access data of uninitialized token");
		if (this._tokenData === null) throw new Error("Invalid token: Token is invalid, try to get a new one");
		return this._tokenData;
	}

	get token(): string { return this._data.access_token; }
	get type(): string { return this._data.token_type; }
	get expiresIn(): number { return this._data.expires_in; }
	get createdAt(): number { return this._data.created_at; }
	get scope(): string { return this._data.scope; }
	get secretValidUntil(): number { return this._data.created_at; }
	get expiresAt(): number {
		const data = this._data;
		return data.created_at + data.expires_in;
	}

	async requestNewToken() {
		if (this._refreshPromise) return this._refreshPromise;

		this._refreshPromise = new Promise(async (resolve, reject) => {
			try {
				const tokenData = await fetchAppToken(this.oauth2Credentials.uid, this.oauth2Credentials.secret);
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
		if (!this._tokenData || !this.isValid)
			return this.requestNewToken();
	}

	async getAccessToken() {
		await this.ensureTokenValidity();
		return this.token;
	}
}
