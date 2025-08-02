import { FtApiFetchError } from "~/generic/request/FtApiFetchError";
import { checkStatus } from "~/typeguards/checkStatus";

export async function handleFtApiResponse<T>(route: string, response: Response, mapper: (...args: any[]) => T): Promise<T> {
	if (response.ok) {
		const data: unknown = await response.json();
		if (data) {
			return mapper(data);
		}
		throw new Error(route);
	}
	if (checkStatus(response.status)) {
		throw new FtApiFetchError(response.status);
	}
	throw new Error(`Unexpected status: ${response.status}`);
}
