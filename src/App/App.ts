import TokenHandler from "./TokenHandler/AppTokenHandler";
import { AppCredentials } from "~/structures/AppCredentials";

export class FtApp {
	secretHandler: TokenHandler;

	constructor(...AppCredentialsList: AppCredentials[]) {
		this.secretHandler = new TokenHandler(AppCredentialsList);
	}
}
