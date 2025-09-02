import { ServerResponse } from "http";

export function redirectResponse(res: ServerResponse, url: string) {
	res.statusCode = 302;
	res.setHeader("Location", url);
	res.end();
}

export function sendRawResponse(res: ServerResponse, code: number, message: string) {
	res.statusCode = code;
	res.write(message);
	res.end();
}
