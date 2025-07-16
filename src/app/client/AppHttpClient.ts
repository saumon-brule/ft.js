import { FtHttpClient } from "~/generic/HttpClient";
import { FtApp } from "../App";
import { Method } from "~/structures/Method";

export class AppHttpClient extends FtHttpClient {
	ftApp: FtApp;

	constructor(ftApp: FtApp) {
		super();
		this.ftApp = ftApp;
	}

	protected async createFetchInit(method: Method, options: RequestInit): Promise<RequestInit> {
		const headers = new Headers();
		if (!headers.has("Authorization")) {
			headers.append("Authorization", `Bearer ${this.ftApp.credentialsManager.token}`);
		}
		return {
			...options,
			method,
			headers
		};
	}
}
