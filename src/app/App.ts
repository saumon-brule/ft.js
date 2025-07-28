import { AppCredentialsManager } from "./TokenManager/AppCredentialsManager";
import { UserManager } from "./UserManager/UserManager";
import { OAuth2ClientConfig } from "~/structures/OAuth2ClientConfig";
import EventEmitter from "events";
import { FtEvent } from "~/structures/Events";
import { OAuth2ServerOptions } from "./server/OAuth2Server";
import { AppHttpClient } from "./client/AppHttpClient";

export type UsedOAuth2ServerOptions = {
	hostname?: string,
	port?: number,
	loginRoute?: string,
	callbackRoute?: string,
	successPage?: string | null,
	errorPage?: string | null
}

const DEFAULT_OAUTH2_SERVER_OPTIONS: OAuth2ServerOptions = {
	hostname: "localhost",
	port: 3042,
	loginRoute: "/",
	callbackRoute: "/callback",
	successPage: null,
	errorPage: null
};

export class FtApp {
	credentialsManager: AppCredentialsManager;
	userManager: UserManager;
	httpClient: AppHttpClient;
	events: EventEmitter<FtEvent>;

	constructor(configs: OAuth2ClientConfig[]) {
		this.credentialsManager = new AppCredentialsManager(configs);
		this.userManager = new UserManager(this);
		this.httpClient = new AppHttpClient(this);
		this.events = new EventEmitter<FtEvent>();
	}

	async login() {
		return this.credentialsManager.init();
	}

	get token() {
		return this.credentialsManager.token;
	}

	startAuthServer(options: UsedOAuth2ServerOptions) {
		this.userManager.server.start({
			...DEFAULT_OAUTH2_SERVER_OPTIONS,
			...options
		});
	}
}
