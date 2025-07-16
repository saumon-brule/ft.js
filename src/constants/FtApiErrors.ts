export const FtApiErrorMessages = {
	400: "Bad request",
	401: "Unauthorized",
	403: "Forbidden",
	404: "Not found",
	422: "Unprocessable entity",
	500: "Server issue"
} as const;

export type FtApiStatus = keyof typeof FtApiErrorMessages;
