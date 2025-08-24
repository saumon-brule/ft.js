import { fetchAppToken } from "~/api/oauth/token";
import { AppTokenData } from "~/structures/FtTokenData";
import { OAuth2Credentials } from "~/app/TokenManager/OAuth2Credentials";
import { FtApp } from "../App";
import { OAuth2CredentialsProps } from "~/structures/OAuth2CredentialsProps";

export class AppCredentials {
	private _tokenData: AppTokenData | null | undefined = undefined;
	private _ftApp;
	oauth2Credentials: OAuth2Credentials;

	private _refreshPromise: Promise<void> | null = null;

	constructor(oauth2CredentialsProps: OAuth2CredentialsProps, ftApp: FtApp) {
		this.oauth2Credentials = new OAuth2Credentials(oauth2CredentialsProps);
		this._ftApp = ftApp;
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
	get secretValidUntil(): number { return this._data.secret_valid_until; }
	get expiresAt(): number {
		const data = this._data;
		return data.created_at + data.expires_in;
	}

	async ensureSecretValidity() {
		const { secretExpirationWarningTime } = this._ftApp.configs;

		const expiringTime = this.secretValidUntil * 1000;
		const now = Date.now();
		const expirationWarningTime = now + secretExpirationWarningTime;

		/* !:! I want to setup an event to know when a token is expired, but this isn't the place to do it

		if (expiringTime < now) {
			this._ftApp.emit("tokenExpired", this.oauth2Credentials, new Date(expiringTime))
		} else */
		if (expiringTime < expirationWarningTime) {
			this._ftApp.emit("tokenExpirationWarning", this.oauth2Credentials, new Date(expiringTime));
		}
	}

	async requestNewToken() {
		if (this._refreshPromise) return this._refreshPromise;

		this._refreshPromise = new Promise(async (resolve, reject) => {
			try {
				this._tokenData = await this.oauth2Credentials.requestAppToken();
				await this.ensureSecretValidity();
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
