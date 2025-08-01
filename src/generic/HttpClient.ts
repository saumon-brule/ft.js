import { ApiRoute } from "~/structures/ApiRoute";
import { API_BASE } from "~/constants/FtApiBase";
import { Method } from "~/structures/Method";

export class FtHttpClient {
	protected async createFetchInit(method: Method, options: RequestInit): Promise<RequestInit> {
		return {
			...options,
			method
		};
	}

	async get(route: ApiRoute, options: RequestInit = {}) {
		return fetch(API_BASE + route, await this.createFetchInit("GET", options));
	}

	async post(route: ApiRoute, options: RequestInit) {
		return fetch(API_BASE + route, await this.createFetchInit("POST", options));
	}
}
