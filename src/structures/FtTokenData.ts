export type AppTokenData = {
	access_token: string,
	token_type: string,
	expires_in: number,
	scope: string,
	created_at: number,
	secret_valid_until: number
}

export type UserTokenData = {
	access_token: string,
	token_type: string,
	expires_in: number,
	refresh_token: string,
	scope: string,
	created_at: number,
	secret_valid_until: number
}
