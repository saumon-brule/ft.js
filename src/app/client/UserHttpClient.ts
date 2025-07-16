import { FtHttpClient } from "~/generic/HttpClient";
import { User } from "~/user/User";
import { Method } from "~/structures/Method";

export class UserHttpClient extends FtHttpClient {
	user: User;

	constructor(user: User) {
		super();
		this.user = user;
	}

	protected async createFetchInit(method: Method, options: RequestInit): Promise<RequestInit> {
		await this.user.userToken.ensureValidity();
		const headers = new Headers();
		if (!headers.has("Authorization")) {
			headers.append("Authorization", `Bearer ${this.user.userToken.token}`);
		}
		return {
			...options,
			method,
			headers
		};
	}
}
