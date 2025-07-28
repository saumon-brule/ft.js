import z from "zod";
import { User } from "~/user/User";
import { meSchema } from "./me.schema";

const ROUTE = "/v2/me";

export async function fetchMe(user: User): Promise<z.infer<typeof meSchema>> {
	return user.httpClient.get(ROUTE)
		.then((response) => response.json())
		.then((data) => {
			return meSchema.parse(data);
		});
}
