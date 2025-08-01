import { User } from "~/user/User";
import { fetchUserToken } from "~/api/oauth/token";
import { FtApp } from "../App";
import { sendRawResponse, redirectResponse } from "../server/serverResponsesHandler";
import { IncomingMessage, ServerResponse } from "node:http";
import { AuthenticatedRequest } from "~/structures/AuthenticatedRequest";
import { UserTokenData } from "~/structures/FtTokenData";
import { OAuth2ClientConfig } from "~/structures/OAuth2ClientConfig";

const INTRA_OAUTH_URL = "https://api.intra.42.fr/oauth/authorize";

export class UserManager {
	users: User[] = [];
	ftApp: FtApp;

	constructor(ftApp: FtApp) {
		this.ftApp = ftApp;
	}

	getUserById(id: number) {
		return this.users.find((user) => user.id === id);
	}

	async registerUser(userTokenData: UserTokenData, oauthConfig: OAuth2ClientConfig) {
		const newUser = await User.create(this.ftApp, userTokenData, oauthConfig);
		let user = this.getUserById(newUser.id);
		if (!user) {
			user = newUser;
		}
		this.users.push(newUser);
		this.ftApp.events.emit("userAdd", newUser);
		return newUser;
	}

	authenticate() {
		return (_: IncomingMessage, res: ServerResponse) => {
			const userConfig = this.ftApp.credentialsManager.oauthConfig;
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

			const appCredentials = this.ftApp.credentialsManager.getCredentialByUid(state);
			if (appCredentials === undefined) {
				if (errorPage) {
					return redirectResponse(res, errorPage);
				}
				return sendRawResponse(res, 400, "Authentification Error");
			}
			const oauthConfig = appCredentials.oauthConfig;

			try {
				const tokenData = await fetchUserToken(code, oauthConfig);
				(req as AuthenticatedRequest).user = await this.registerUser(tokenData, oauthConfig);

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
