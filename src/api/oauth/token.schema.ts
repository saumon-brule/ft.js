import { z } from "zod";

export const appTokenSchema = z.object({
	access_token: z.string(),
	token_type: z.string(),
	expires_in: z.number(),
	scope: z.string(),
	created_at: z.number(),
	secret_valid_until: z.number()
}).transform((data) => {
	return {
		token: data.access_token,
		type: data.token_type,
		scope: data.scope,
		expiresIn: data.expires_in,
		createdAt: data.created_at,
		expiresAt: data.created_at + data.expires_in,
		secretValidUntil: data.secret_valid_until
	};
});

export type AppTokenData = z.infer<typeof appTokenSchema>;

export const userTokenSchema = z.object({
	access_token: z.string(),
	token_type: z.string(),
	expires_in: z.number(),
	refresh_token: z.string(),
	scope: z.string(),
	created_at: z.number(),
	secret_valid_until: z.number()
}).transform((data) => {
	return {
		token: data.access_token,
		type: data.token_type,
		scope: data.scope,
		refreshToken: data.refresh_token,
		expiresIn: data.expires_in,
		createdAt: data.created_at,
		expiresAt: data.created_at + data.expires_in,
		secretValidUntil: data.secret_valid_until
	};
});

export type UserTokenData = z.infer<typeof userTokenSchema>;
