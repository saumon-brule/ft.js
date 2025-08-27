import { fetchMe } from "./api/me.js";
import { fetchAppToken, fetchRefreshUserToken, fetchUserToken } from "./api/oauth/token.js";
import { FtApp } from "./app/App.js";
export default FtApp;

export { AuthenticatedRequest } from "~/structures/AuthenticatedRequest.js";
export { default as FtRequestParams } from "./generic/ftRequestParams/FtRequestParams.js";

export const requests = {
	me: fetchMe,
	oauth: {
		appToken: fetchAppToken,
		userToken: fetchUserToken,
		refreshUserToken: fetchRefreshUserToken
	}
};
