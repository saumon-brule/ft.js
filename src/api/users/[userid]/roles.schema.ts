import { z } from "zod";

export const userRolesSchema = z.array(
	z.object({
		id: z.number(),
		name: z.string(),
		description: z.string()
	})
);

export type UserRoleData = z.infer<typeof userRolesSchema>;
