import { User } from "~/user/User";
import { fetchUserToken } from "~/api/oauth/token";
import { FtApp } from "../App";
import { AppCredential } from "../TokenManager/AppCredential";
import { sendRawResponse, redirectResponse } from "../server/serverResponsesHandler";
import { IncomingMessage, ServerResponse } from "node:http";
import { AuthenticatedRequest } from "~/structures/AuthenticatedRequest";
import { UserTokenData } from "~/structures/FtTokenData";

const INTRA_OAUTH_URL = "https://api.intra.42.fr/oauth/authorize";

export class UserManager {
	users: User[] = [];
	ftApp: FtApp;

	constructor(ftApp: FtApp) {
		this.ftApp = ftApp;
	}

	async registerUser(userTokenData: UserTokenData, appCredential: AppCredential) {
		const user = new User(this.ftApp, userTokenData, appCredential);
		await user.load();
		this.users.push(user);
		this.ftApp.events.emit("userAdd", user);
		return user;
	}

	authenticate() {
		return (_: IncomingMessage, res: ServerResponse) => {
			const userConfig = this.ftApp.credentialsManager.config;
			const params = new URLSearchParams();
			params.append("client_id", userConfig.uid);
			params.append("redirect_uri", userConfig.redirectURI);
			params.append("response_type", "code");
			params.append("state", userConfig.uid);

			const url = `${INTRA_OAUTH_URL}?${params.toString()}`;
			res.statusCode = 302;
			res.setHeader("Location", url);
			res.end();
		};
	}

	callback({ successPage, errorPage }: { successPage?: string, errorPage?: string } = {}) {
		return async (req: IncomingMessage, res: ServerResponse, next?: any) => {
			const isExpress = typeof next === "function";

			const url = new URL(req.url ?? "", "http://localhost:3042");

			const code = url.searchParams.get("code");
			const state = url.searchParams.get("state");
			if (!code || !state) {
				if (errorPage) {
					return redirectResponse(res, errorPage);
				}
				return sendRawResponse(res, 400, "Authentification Error");
			}

			const appCredential = this.ftApp.credentialsManager.appCredentials.find((appCredential) => appCredential.appConfig.uid === state);
			if (appCredential === undefined) {
				if (errorPage) {
					return redirectResponse(res, errorPage);
				}
				return sendRawResponse(res, 400, "Authentification Error");
			}

			try {
				const tokenData = await fetchUserToken(code, appCredential.appConfig);
				(req as AuthenticatedRequest).user = await this.registerUser(tokenData, appCredential);

				if (isExpress) return next();
				if (successPage) {
					return redirectResponse(res, successPage);
				}
				return sendRawResponse(res, 200, "Authentification Success");
			} catch (error: any) {
				if (errorPage) {
					redirectResponse(res, errorPage);
				} else {
					sendRawResponse(res, 500, "Server Error");
				}
				throw error;
			}
		};
	}
}
