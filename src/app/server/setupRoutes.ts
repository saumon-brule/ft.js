import { Express } from "express";
import { fetchUserToken, UserTokenData } from "~/api/oauth/token";
import { AppCredentialsManager } from "~/app/TokenManager/AppCredentialsManager";
import { AppTokenData } from "~/api/oauth/token";
import { AppCredential } from "~/app/TokenManager/AppCredential";

const INTRA_OAUTH_URL = "https://api.intra.42.fr/oauth/authorize";

export function setupLoginRoute(app: Express, credentialManager: AppCredentialsManager, loginRoute: string) {
	app.get(loginRoute, (_, res) => {
		const userConfig = credentialManager.config;
		const params = new URLSearchParams();
		params.append("client_id", userConfig.uid);
		params.append("redirect_uri", userConfig.redirectURI);
		params.append("response_type", "code");
		params.append("state", userConfig.uid);
		res.redirect(`${INTRA_OAUTH_URL}?${params.toString()}`);
	});
}

export function setupCallbackRoute(
	app: Express,
	credentialManager: AppCredentialsManager,
	{
		callbackRoute,
		successPage,
		errorPage
	}: {
		callbackRoute: string,
		successPage: string,
		errorPage: string
	},
	registerNewUser: (userTokenData: UserTokenData, appCredentials: AppCredential) => void
) {
	app.get(callbackRoute, async (req, res) => {
		const code = typeof req.query.code === "string" ? req.query.code : undefined;
		const state = req.query.state;
		if (!code || !state) return res.status(400).sendFile(errorPage);

		const appCredential = credentialManager.appCredentials.find((appCredential) => appCredential.appConfig.uid === state);
		if (appCredential === undefined) return res.status(400).sendFile(errorPage);
		try {
			const tokenData = await fetchUserToken(code, appCredential.appConfig);
			registerNewUser(tokenData, appCredential);
			return res.status(200).sendFile(successPage);
		} catch (error: any) {
			console.error(error);
			return res.status(error?.status ?? 400).sendFile(errorPage);
		}
	});
}
