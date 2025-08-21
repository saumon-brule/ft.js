export class FtConfig {
	secretExpirationWarningTime: number = 1000 * 60 * 60 * 24 * 7; // 1 week
	constructor() { }

	setSecretExpirationWarningTime(time: number) {
		this.secretExpirationWarningTime = time;
		return (this);
	}
}
