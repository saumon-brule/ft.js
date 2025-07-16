import { AppCredentialsManager } from "./TokenManager/AppCredentialsManager";
import { UserManager } from "./UserManager/UserManager";
import { OAuth2ClientConfig } from "~/structures/OAuth2ClientConfig";
import EventEmitter from "events";
import { FtEvent } from "~/structures/Events";
import { OAuth2ServerOptions } from "./server/OAuth2Server";
import { AppHttpClient } from "./client/AppHttpClient";

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

	startAuthServer(options: OAuth2ServerOptions = {
		hostname: "localhost",
		port: 3042,
		loginRoute: "/",
		callbackRoute: "/callback",
		successPage: "/home/saumon/dev/perso/ft-js/web/success.html",
		errorPage: "/home/saumon/dev/perso/ft-js/web/error.html"
	}) {
		this.userManager.server.start(options);
	}
}
