import { AppCredentialsManager } from "~/app/TokenManager/AppCredentialsManager";
import { Express } from "express";
import { Server } from "http";
import { setupCallbackRoute, setupLoginRoute } from "./setupRoutes";
import { createRequire } from "module";
import { FtApp } from "~/app/App";
import { UserManager } from "~/app/UserManager/UserManager";
import { appendFile } from "fs";

export type OAuth2ServerOptions = {
	hostname: string,
	port: number,
	loginRoute: string,
	callbackRoute: string,
	successPage: string | null,
	errorPage: string | null
}

async function importExpress(): Promise<() => Express> {
	try {
		const require = createRequire(import.meta.url);
		const express = require("express");
		return express;
	} catch (_) {
		throw new Error("Couldn't import 'express' module. Please run 'npm install express' if you want to use oauth2 server features");
	}
}

export class OAuth2Server {
	credentialsManager: AppCredentialsManager;
	userManager: UserManager;
	ftApp: FtApp;
	server: Server | null = null;
	private expressApp: Express | null = null;

	constructor(ftApp: FtApp, userManager: UserManager) {
		this.ftApp = ftApp;
		this.userManager = userManager;
		this.credentialsManager = ftApp.credentialsManager;
	}

	async start({ hostname, port, loginRoute, callbackRoute, successPage, errorPage }: OAuth2ServerOptions) {
		const express = await importExpress();
		this.expressApp = express();
		setupLoginRoute(this.expressApp, this.credentialsManager, loginRoute);
		setupCallbackRoute(
			this.expressApp,
			this.credentialsManager,
			callbackRoute,
			successPage,
			errorPage,
			this.userManager.registerUser.bind(this.userManager)
		);
		this.server = this.expressApp.listen(port, hostname, () => {
			this.ftApp.events.emit("serverOn", this);
		});
	}
}
