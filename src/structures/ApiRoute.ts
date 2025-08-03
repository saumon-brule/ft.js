type KnownRoute =
	| "/v2/me"

type UnknownRoute = string & { __brand?: "unknown" }

export type ApiRoute = KnownRoute | UnknownRoute;
