import { fetchAppToken, fetchRefreshUserToken, fetchUserToken } from "~/api/oauth/token";
import { OAuth2CredentialsProps } from "~/structures/OAuth2CredentialsProps";

export class OAuth2Credentials {
	#secret: string;
	private _uid: string;
	private _redirectURI?: string;

	constructor(oauth2CredentialsProps: OAuth2CredentialsProps) {
		this._uid = oauth2CredentialsProps.uid;
		this.#secret = oauth2CredentialsProps.secret;
		if (oauth2CredentialsProps.redirectURI != undefined) {
			this._redirectURI = oauth2CredentialsProps.redirectURI;
		}
	}

	get uid() {
		return this._uid;
	}

	get redirectURI() {
		return this._redirectURI ?? "";
	}

	setSecret(newSecret: string) {
		this.#secret = newSecret;
	}

	async requestAppToken() {
		return fetchAppToken(this._uid, this.#secret);
	}

	async requestUserToken(code: string) {
		if (!this._redirectURI)
			throw new Error("No redirect URI");
		return fetchUserToken(code, this._uid, this.#secret, this._redirectURI);
	}

	async requestRefreshUserToken(refreshToken: string) {
		return fetchRefreshUserToken(refreshToken, this._uid, this.#secret);
	}
};
