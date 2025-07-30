import { IncomingMessage } from "node:http";
import { User } from "~/user/User";

export class AuthenticatedRequest extends IncomingMessage {
	user?: User;
}
