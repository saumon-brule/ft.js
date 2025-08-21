import { OAuth2CredentialsParams } from "~/structures/OAuth2CredentialsParams";

export class OAuth2Credentials {
	private _uid: string;
	private _secret: string;
	private _redirectURI?: string;

	constructor(oauth2CredentialsParams: OAuth2CredentialsParams) {
		this._uid = oauth2CredentialsParams.uid;
		this._secret = oauth2CredentialsParams.secret;
		if (oauth2CredentialsParams.redirectURI != undefined) {
			this._redirectURI = oauth2CredentialsParams.redirectURI;
		}
	}

	get uid() {
		return this._uid;
	}

	get secret() {
		return this._secret;
	}

	get redirectURI() {
		return this._redirectURI ?? "";
	}

	setSecret(newSecret: string) {
		this._secret = newSecret;
	}
};
