import { z } from "zod";

export const appTokenSchema = z.object({
	access_token: z.string(),
	token_type: z.string(),
	expires_in: z.number(),
	scope: z.string(),
	created_at: z.number(),
	secret_valid_until: z.number()
});

export const userTokenSchema = z.object({
	access_token: z.string(),
	token_type: z.string(),
	expires_in: z.number(),
	refresh_token: z.string(),
	scope: z.string(),
	created_at: z.number(),
	secret_valid_until: z.number()
});
