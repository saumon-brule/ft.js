import { AppToken } from "./AppToken";
import { AppCredentials } from "~/structures/AppCredentials";

export class AppTokenManager {
	appTokens: AppToken[] = [];
	activeAppTokenIndex: number = 0;

	constructor(secrets: AppCredentials[]) {
		secrets.forEach((secret) => {
			this.appTokens.push(new AppToken(secret));
		});
	}

	async init(): Promise<void> {
		if (this.appTokens.length === 0) {
			throw new Error("No App credentials found");
		}
		const promises: Promise<void>[] = [];
		this.appTokens.forEach((token) => {
			promises.push(token.refresh());
		});
		await Promise.all(promises);
	}

	shift(offset?: number) {
		this.activeAppTokenIndex = (this.activeAppTokenIndex + (offset ?? 1)) % this.appTokens.length;
	}

	active(): string | null {
		return this.appTokens[this.activeAppTokenIndex].token;
	}

	get token(): string | null {
		const startIndex = this.activeAppTokenIndex;
		do {
			const token = this.active();
			this.shift();
			if (token)
				return token;
		} while (startIndex != this.activeAppTokenIndex);
		return null;
	}
}
