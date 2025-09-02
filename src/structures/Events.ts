import { User } from "~/user/User";
import { OAuth2Credentials } from "~/generic/credentials/OAuth2Credentials";

export type FtEvent = {
	userAdd: [User];
	userRegister: [User];
	tokenExpirationWarning: [OAuth2Credentials, Date];
	tokenExpired: [OAuth2Credentials, Date];
}
