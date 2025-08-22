import { defaultFtConfigs } from "~/constants/DefaultConfig";

export type FtConfigProps = {
	[K in keyof FtConfig as FtConfig[K] extends Function ? never : K]?: FtConfig[K]
}

export class FtConfig {
	secretExpirationWarningTime: number = defaultFtConfigs.SECRET_EXPIRATION_WARNING_TIME; // 1 week

	constructor(configProps?: FtConfigProps) {
		if (configProps) {
			Object.assign(this, configProps);
		}
	}

	setSecretExpirationWarningTime(time: number) {
		this.secretExpirationWarningTime = time;
		return (this);
	}
}
