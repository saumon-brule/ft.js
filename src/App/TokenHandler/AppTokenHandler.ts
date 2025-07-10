import AppToken from "./AppToken";
import { AppCredentials } from "~/structures/AppCredentials";

export default class AppTokenHandler {
	private appTokens: AppToken[] = [];
	private activeAppTokenIndex: number = 0;

	constructor(secrets: AppCredentials[]) {
		secrets.forEach((secret) => {
			this.appTokens.push(new AppToken(secret));
		});
	}

	shift(step?: number) {
		this.activeAppTokenIndex += (this.activeAppTokenIndex + (step ?? 1)) % this.appTokens.length;
	}

	active(): string|null {
		return this.appTokens[this.activeAppTokenIndex].token;
	}

	get current(): string|null {
		const result = this.active();
		this.shift();
		return result;
	}
}
