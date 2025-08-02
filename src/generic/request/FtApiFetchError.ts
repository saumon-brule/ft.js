import { FtApiErrorMessages, FtApiStatus } from "~/constants/FtApiErrors";

export class FtApiFetchError extends Error {
	status: FtApiStatus;

	constructor(status: FtApiStatus) {
		super(FtApiErrorMessages[status]);
		this.status = status;
	}
}
