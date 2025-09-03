import { API_BASE } from "~/constants/FtApiBase";
import { handleFtApiResponse } from "~/generic/request/handleResponse";
import FtApiHeaders from "~/generic/request/FtHeaders";
import { UserRoleData, userRolesSchema } from "./roles.schema";


export async function fetchUserRoles(token: string, userId: string | number, options?: RequestInit): Promise<UserRoleData> {
	const route = `/v2/users/${userId}/roles`;

	const headers = new FtApiHeaders(options?.headers, token);

	const usedOptions: RequestInit = {
		headers,
		...options
	};

	return fetch(`${API_BASE}${route}`, usedOptions)
		.then((response) => handleFtApiResponse(route, response, userRolesSchema));
}
