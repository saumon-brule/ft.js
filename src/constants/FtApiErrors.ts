export type FtApiStatus = 400 | 401 | 403 | 404 | 422 | 500;

export const FtApiErrors: Record<FtApiStatus, string> = {
	400: "Malformed",
	401: "Unauthorized",
	403: "Forbidden",
	404: "Not found",
	422: "Unprocessable entity",
	500: "Server issue"
};
