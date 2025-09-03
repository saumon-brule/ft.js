// import { meSchema } from "./me.schema";
import { API_BASE } from "~/constants/FtApiBase";
import { handleFtApiResponse } from "~/generic/request/handleResponse";
import FtApiHeaders from "~/generic/request/FtHeaders";
import z from "zod";

const ROUTE = "/v2/me";

export async function fetchMe(token: string, options?: RequestInit): Promise<any>/*Promise<z.infer<typeof meSchema>>*/ {
	const headers = new FtApiHeaders(options?.headers, token);

	const usedOptions: RequestInit = {
		headers,
		...options
	};

	return fetch(`${API_BASE}${ROUTE}`, usedOptions)
		.then((response) => handleFtApiResponse(ROUTE, response, z.any()));
}
