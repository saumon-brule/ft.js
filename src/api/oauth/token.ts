import { API_BASE } from "~/constants/FtApiBase";
import { FtApiFetchError } from "~/generic/request/FtApiFetchError";
import { AppTokenData, appTokenSchema, UserTokenData, userTokenSchema } from "./token.schema";
import { checkStatus } from "~/typeguards/checkStatus";
import { handleFtApiResponse } from "~/generic/request/handleResponse";

const ROUTE = "/oauth/token";

export async function fetchAppToken(uid: string, secret: string) {
	const body = new URLSearchParams();
	body.append("grant_type", "client_credentials");
	body.append("client_id", uid);
	body.append("client_secret", secret);

	const options: RequestInit = {
		method: "POST",
		body
	};

	return fetch(`${API_BASE}${ROUTE}`, options)
		.then(async (response) => {
			if (response.ok) {
				const data: unknown = await response.json();
				return appTokenSchema.parse(data);
			}
			if (checkStatus(response.status)) {
				throw new FtApiFetchError(response.status);
			}
			throw new Error(`Unexpected status: ${response.status}`);
		});
}

export async function fetchUserToken(code: string, uid: string, secret: string, redirectURI: string) {
	const body = new URLSearchParams();
	body.append("grant_type", "authorization_code");
	body.append("code", code);
	body.append("client_id", uid);
	body.append("client_secret", secret);
	body.append("redirect_uri", redirectURI);
	body.append("scope", "identify");

	const options: RequestInit = {
		method: "POST",
		body
	};

	return fetch(`${API_BASE}${ROUTE}`, options).then(async (response) =>
		handleFtApiResponse(ROUTE, response, userTokenSchema));
}

export async function fetchRefreshUserToken(refreshToken: string, uid: string, secret: string) {
	const body = new URLSearchParams();
	body.append("grant_type", "refresh_token");
	body.append("refresh_token", refreshToken);
	body.append("client_id", uid);
	body.append("client_secret", secret);

	const options: RequestInit = {
		method: "POST",
		body
	};

	return fetch(`${API_BASE}${ROUTE}`, options).then(async (response) =>
		handleFtApiResponse(ROUTE, response, userTokenSchema));
}
