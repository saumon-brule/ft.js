import { fetchMe } from "./api/me.js";
import { fetchUserRoles } from "./api/users/[userid]/roles.js";
import { fetchAppToken, fetchRefreshUserToken, fetchUserToken } from "./api/oauth/token.js";
import { FtApp } from "./app/App.js";
export default FtApp;

export { AuthenticatedRequest } from "~/structures/AuthenticatedRequest.js";
export { default as FtRequestParams } from "./generic/ftRequestParams/FtRequestParams.js";

export const request = {
	oauth: {
		appToken: fetchAppToken,
		userToken: fetchUserToken,
		refreshUserToken: fetchRefreshUserToken
	},
	user: {
		byId: (id: number | string) => ({
			roles: (token: string, options?: RequestInit) => fetchUserRoles(token, id, options)
		})
	},
	me: fetchMe
};
