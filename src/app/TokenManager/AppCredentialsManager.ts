import { AppCredentials } from "./AppCredentials";
import { OAuth2ClientConfig } from "~/structures/OAuth2ClientConfig";

/*
missing :
in the method `token` it would be great if a token isn't available, to get another one while its being fetched
a way to refresh every possible token

*/
export class AppCredentialsManager {
	protected _appCredentialsList: AppCredentials[];
	protected _activeAppTokenIndex: number = 0;

	constructor(configs: OAuth2ClientConfig[]) {
		this._appCredentialsList = configs.map((config) => {
			return new AppCredentials(config);
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

	get oauthConfig() {
		const oauthConfig = this._current.oauthConfig;
		this._shift();
		return oauthConfig;
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
		return this._appCredentialsList.find((appCredentials) => appCredentials.oauthConfig.uid === uid);
	}
}
