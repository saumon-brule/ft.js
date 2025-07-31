import { AppCredentialsManager } from "./TokenManager/AppCredentialsManager";
import { UserManager } from "./UserManager/UserManager";
import { OAuth2ClientConfig } from "~/structures/OAuth2ClientConfig";
import EventEmitter from "events";
import { FtEvent } from "~/structures/Events";
import { AppHttpClient } from "./client/AppHttpClient";

export type OAuth2ServerOptions = {
	hostname?: string,
	port?: number,
	loginRoute?: string,
	callbackRoute?: string,
	successPage?: string | null,
	errorPage?: string | null
}

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
}
