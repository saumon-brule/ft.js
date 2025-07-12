import { FtApiErrors, FtApiStatus } from "~/constants/FtApiErrors";

export class FtApiFetchError extends Error {
	status: FtApiStatus;

	constructor(status: FtApiStatus) {
		super(`Error: ${FtApiErrors[status]}`);
		this.status = status;
	}
}
