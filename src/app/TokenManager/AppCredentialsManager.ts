import { AppCredentials } from "./AppCredentials";
import { OAuth2ClientConfig } from "~/structures/OAuth2ClientConfig";

/*
missing :
in the method `token` it would be great if a token isn't available, to get another one while its being fetched
a way to refresh every possible token

*/
export class AppCredentialsManager {
	appCredentialsList: AppCredentials[];
	private activeAppTokenIndex: number = 0;

	constructor(configs: OAuth2ClientConfig[]) {
		this.appCredentialsList = configs.map((config) => {
			return new AppCredentials(config);
		});
	}

	private get _current() {
		return this.appCredentialsList[this.activeAppTokenIndex];
	}

	private shift(offset: number = 1) {
		this.activeAppTokenIndex = (this.activeAppTokenIndex + offset) % this.appCredentialsList.length;
	}

	get credentials() {
		const credentials = this._current;
		this.shift();
		return credentials;
	}

	get oauthConfig() {
		const oauthConfig = this._current.oauthConfig;
		this.shift();
		return oauthConfig;
	}

	get token() {
		const token = this._current.token;
		this.shift();
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
		this.shift();
		return currentCredentials.getAccessToken();
	}

	async requestNewToken() {
		this._current.requestNewToken();
	}

	async requestNewTokens() {
		const promiseList: Promise<void>[] = [];
		this.appCredentialsList.forEach((appCredentials) => promiseList.push(appCredentials.requestNewToken()));
		return Promise.all(promiseList);
	}

	getCredentialByUid(uid: string) {
		return this.appCredentialsList.find((appCredentials) => appCredentials.oauthConfig.uid === uid);
	}
}
