import { AppCredentials } from "./AppCredentials";
import { OAuth2Credentials } from "~/structures/OAuth2Credentials";

/*
missing :
in the method `token` it would be great if a token isn't available, to get another one while its being fetched
a way to refresh every possible token

*/
export class AppCredentialsManager {
	protected _appCredentialsList: AppCredentials[];
	protected _activeAppTokenIndex: number = 0;

	constructor(oauth2CredentialsList: OAuth2Credentials[]) {
		this._appCredentialsList = oauth2CredentialsList.map((oauth2Credentials) => {
			return new AppCredentials(oauth2Credentials);
		});
	}

	protected get _current() {
		return this._appCredentialsList[this._activeAppTokenIndex];
	}

	protected _shift(offset: number = 1) {
		this._activeAppTokenIndex = (this._activeAppTokenIndex + offset) % this._appCredentialsList.length;
	}

	get credentials() {
		const credentials = this._current;
		this._shift();
		return credentials;
	}

	get oauth2Credentials() {
		const oauth2Credentials = this._current.oauth2Credentials;
		this._shift();
		return oauth2Credentials;
	}

	get token() {
		const token = this._current.token;
		this._shift();
		return token;
	}

	get isValid() {
		return this._current.isValid;
	}

	async ensureTokenValidity() {
		return this._current.ensureTokenValidity();
	}

	async getAccessToken() {
		const currentCredentials = this._current;
		this._shift();
		return currentCredentials.getAccessToken();
	}

	async requestNewToken() {
		this._current.requestNewToken();
	}

	async requestNewTokens() {
		const promiseList: Promise<void>[] = [];
		this._appCredentialsList.forEach((appCredentials) => promiseList.push(appCredentials.requestNewToken()));
		return Promise.all(promiseList);
	}

	getCredentialByUid(uid: string) {
		return this._appCredentialsList.find((appCredentials) => appCredentials.oauth2Credentials.uid === uid);
	}
}
