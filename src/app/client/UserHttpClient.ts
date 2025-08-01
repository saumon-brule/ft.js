import { FtHttpClient } from "~/generic/HttpClient";
import { User } from "~/user/User";
import { Method } from "~/structures/Method";

export class UserHttpClient extends FtHttpClient {
	user: User;

	constructor(user: User) {
		super();
		this.user = user;
	}

	protected async _createFetchInit(method: Method, options: RequestInit): Promise<RequestInit> {
		const userToken = await this.user.credentials.getAccessToken();
		const headers = new Headers();
		if (!headers.has("Authorization")) {
			headers.append("Authorization", `Bearer ${userToken}`);
		}
		return {
			...options,
			method,
			headers
		};
	}
}
