import { FtApiErrors, FtApiStatus } from "~/constants/FtApiErrors";

export default class FtApiFetchError extends Error {
	status: FtApiStatus;

	constructor(status: FtApiStatus) {
		super(`Error: ${FtApiErrors[status]}`);
		this.status = status;
	}
}
