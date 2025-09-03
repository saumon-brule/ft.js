import { FtHttpClient } from "~/generic/request/HttpClient";
import { User } from "~/user/User";
import { Method } from "~/structures/Method";
import FtApiHeaders from "~/generic/request/FtHeaders";

export class UserHttpClient extends FtHttpClient {
	user: User;

	constructor(user: User) {
		super();
		this.user = user;
	}

	protected async _createFetchInit(method: Method, options: RequestInit): Promise<RequestInit> {
		const userToken = await this.user.credentials.getAccessToken();
		const headers = new FtApiHeaders(options.headers, userToken);

		return {
			...options,
			method,
			headers
		};
	}
}
