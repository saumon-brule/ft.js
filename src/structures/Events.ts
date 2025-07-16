import { OAuth2Server } from "~/app/server/OAuth2Server";
import { User } from "~/user/User";

export type FtEvent = {
	userAdd: [User];
	serverOn: [OAuth2Server];
}
