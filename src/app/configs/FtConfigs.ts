import { defaultFtConfigs } from "~/constants/DefaultConfig";

export class FtConfig {
	secretExpirationWarningTime: number = defaultFtConfigs.SECRET_EXPIRATION_WARNING_TIME; // 1 week
	constructor() { }

	setSecretExpirationWarningTime(time: number) {
		this.secretExpirationWarningTime = time;
		return (this);
	}
}
