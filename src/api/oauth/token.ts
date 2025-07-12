import { FtApiFetchError } from "~/generic/class/FtApiFetchError";
import { checkStatus } from "~/typeguards/checkStatus";

type AppTokenReponse = {
	access_token: string,
	token_type: string,
	expires_in: number,
	scope: string,
	created_at: number,
	secret_valid_until: number
}

function checkData(data: unknown): data is AppTokenReponse {
	return typeof data === "object" && data !== null
		&& "access_token" in data && typeof data.access_token === "string"
		&& "token_type" in data && typeof data.token_type === "string"
		&& "expires_in" in data && typeof data.expires_in === "number"
		&& "scope" in data && typeof data.scope === "string"
		&& "created_at" in data && typeof data.created_at === "number"
		&& "secret_valid_until" in data && typeof data.secret_valid_until === "number";
}

export async function getAppToken(uid: string, secret: string): Promise<AppTokenReponse> {
	const body = new URLSearchParams();
	body.append("grant_type", "client_credentials");
	body.append("client_id", uid);
	body.append("client_secret", secret);

	const options: RequestInit = {
		method: "POST",
		body
	};

	return fetch("https://api.intra.42.fr/oauth/token", options)
		.then(async (response) => {
			if (response.ok) {
				const data: unknown = await response.json();
				if (checkData(data)) {
					return data as AppTokenReponse;
				}
				throw new Error("Unexpected response data");
			}
			if (checkStatus(response.status)) {
				throw new FtApiFetchError(response.status);
			}
			throw new Error(`Unexpected status: ${response.status}`);
		});
}
