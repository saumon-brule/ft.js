import { FtHttpClient } from "~/generic/request/HttpClient";
import { FtApp } from "../App";
import { Method } from "~/structures/Method";
import FtApiHeaders from "~/generic/request/FtHeaders";

export class AppHttpClient extends FtHttpClient {
	ftApp: FtApp;

	constructor(ftApp: FtApp) {
		super();
		this.ftApp = ftApp;
	}

	protected async _createFetchInit(method: Method, options: RequestInit): Promise<RequestInit> {
		const appToken = await this.ftApp.credentialsManager.getAccessToken();
		const headers = new FtApiHeaders(options.headers, appToken);

		return {
			...options,
			method,
			headers
		};
	}
}
