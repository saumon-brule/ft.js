import { resolvePtr } from "node:dns/promises";
import { API_BASE } from "~/constants/FtApiBase";
import { FtApiFetchError } from "~/generic/class/FtApiFetchError";
import { OAuth2ClientConfig } from "~/structures/OAuth2ClientConfig";
import { checkStatus } from "~/typeguards/checkStatus";

const ROUTE = "/oauth/token";

export type AppTokenData = {
	access_token: string,
	token_type: string,
	expires_in: number,
	scope: string,
	created_at: number,
	secret_valid_until: number
}

function appTokenResponseGuard(data: unknown): data is AppTokenData {
	return data !== null && typeof data === "object"
		&& Object.keys(data).length === 6
		&& "access_token" in data && typeof data.access_token === "string"
		&& "token_type" in data && typeof data.token_type === "string"
		&& "expires_in" in data && typeof data.expires_in === "number"
		&& "scope" in data && typeof data.scope === "string"
		&& "created_at" in data && typeof data.created_at === "number"
		&& "secret_valid_until" in data && typeof data.secret_valid_until === "number";
}

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
				if (appTokenResponseGuard(data)) {
					return data as AppTokenData;
				}
				throw new Error(ROUTE);
			}
			if (checkStatus(response.status)) {
				throw new FtApiFetchError(response.status);
			}
			throw new Error(`Unexpected status: ${response.status}`);
		});
}

export type UserTokenData = {
	access_token: string,
	token_type: string,
	expires_in: number,
	refresh_token: string,
	scope: string,
	created_at: number,
	secret_valid_until: number
}

function userTokenResponseGuard(data: unknown): data is UserTokenData {
	return data !== null && typeof data === "object"
		&& Object.keys(data).length === 7
		&& "access_token" in data && typeof data.access_token === "string"
		&& "token_type" in data && typeof data.token_type === "string"
		&& "expires_in" in data && typeof data.expires_in === "number"
		&& "refresh_token" in data && typeof data.refresh_token === "string"
		&& "scope" in data && typeof data.scope === "string"
		&& "created_at" in data && typeof data.created_at === "number"
		&& "secret_valid_until" in data && typeof data.secret_valid_until === "number";
}

export async function fetchUserToken(code: string, config: OAuth2ClientConfig) {
	const body = new URLSearchParams();
	body.append("grant_type", "authorization_code");
	body.append("code", code);
	body.append("client_id", config.uid);
	body.append("client_secret", config.secret);
	body.append("redirect_uri", config.redirectURI);
	body.append("scope", "identify");

	const options: RequestInit = {
		method: "POST",
		body
	};

	return fetch(`${API_BASE}${ROUTE}`, options).then(async (response) => {
		if (response.ok) {
			const data: unknown = await response.json();
			if (userTokenResponseGuard(data)) {
				return data as UserTokenData;
			}
			throw new Error(ROUTE);
		}
		if (checkStatus(response.status)) {
			throw new FtApiFetchError(response.status);
		}
		throw new Error(`Unexpected status: ${response.status}`);
	});
}

export async function fetchRefreshUserToken(refreshToken: string, config: OAuth2ClientConfig) {
	const body = new URLSearchParams();
	body.append("grant_type", "refresh_token");
	body.append("refresh_token", refreshToken);
	body.append("client_id", config.uid);
	body.append("client_secret", config.secret);

	const options: RequestInit = {
		method: "POST",
		body
	};

	return fetch(`${API_BASE}${ROUTE}`, options).then(async (response) => {
		if (response.ok) {
			const data: unknown = await response.json();
			if (userTokenResponseGuard(data)) {
				return data as UserTokenData;
			}
			throw new Error(ROUTE);
		}
		if (checkStatus(response.status)) {
			throw new FtApiFetchError(response.status);
		}
		throw new Error(`Unexpected status: ${response.status}`);
	});
}
