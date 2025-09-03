
export type KnownRoute =
	| "/v2/me"
	| "/v2/users/:userid/roles";

type UnknownRoute = string & { __brand?: "unknown" }

export type ApiRoute = KnownRoute | UnknownRoute;
