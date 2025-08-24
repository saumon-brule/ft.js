import z from "zod";
import { FtApiFetchError } from "~/generic/request/FtApiFetchError";
import { checkStatus } from "~/typeguards/checkStatus";

export async function handleFtApiResponse<T>(route: string, response: Response, schema: z.ZodSchema<T>): Promise<T> {
	if (response.ok) {
		const data: unknown = await response.json();
		if (data) {
			return schema.parse(data);
		}
		throw new Error(route);
	}
	if (checkStatus(response.status)) {
		throw new FtApiFetchError(response.status);
	}
	const data = await response.json();
	if (data && data.message && data.error) {
		throw new Error(`Unexpected error ${response.status}: ${data.error}: ${data.message}`);
	}
	throw new Error(`Unexpected error ${response.status}`);
}
