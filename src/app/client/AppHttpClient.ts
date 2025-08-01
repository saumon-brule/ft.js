import { FtHttpClient } from "~/generic/class/HttpClient";
import { FtApp } from "../App";
import { Method } from "~/structures/Method";

export class AppHttpClient extends FtHttpClient {
	ftApp: FtApp;

	constructor(ftApp: FtApp) {
		super();
		this.ftApp = ftApp;
	}

	protected async _createFetchInit(method: Method, options: RequestInit): Promise<RequestInit> {
		const appToken = await this.ftApp.credentialsManager.getAccessToken();
		const headers = new Headers();
		headers.append("Authorization", `Bearer ${appToken}`);

		return {
			...options,
			method,
			headers
		};
	}
}
