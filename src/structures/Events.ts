import { User } from "~/user/User";
import { FtApp } from "~/app/App";
import { OAuth2Credentials } from "~/app/credentials/OAuth2Credentials";

export type FtEvent = {
	userAdd: [User];
	tokenExpirationWarning: [OAuth2Credentials, Date];
	tokenExpired: [OAuth2Credentials, Date];
}
