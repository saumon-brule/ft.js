export default class FtApiHeaders extends Headers {
	constructor(token: string)
	constructor(headerInit: HeadersInit, token: string)
	constructor(ftApiHeadersInit: HeadersInit | string, token?: string) {
		if (typeof ftApiHeadersInit === "string") {
			super();
			this.append("Authorization", `Bearer ${ftApiHeadersInit}`);
		} else {
			super(ftApiHeadersInit);
			if (token && !this.has("Authorization")) {
				this.append("Authorization", `Bearer ${token}`);
			}
		}

	}
}
