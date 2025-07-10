import { FtApiStatus } from "~/constants/FtApiErrors";

export default function checkStatus(status: number): status is FtApiStatus {
	return (status === 400 || status === 401 || status === 403 || status === 404 || status === 422 || status === 500);
}
