import { IConfig } from "./src/types/IConfig";

export const config:IConfig = {
	/**
	 * The `palette` option contains soft non-conflicting colors, but the player limit is 15.
	 * The `random` option creates random colors, which can make them close to indistinguishable.
	 * I advise you to use `random` only if there are more than 15 players.
	 */
	colorMode: "palette",
	/** If player limit is more than 15 and colorMode is `palette` limit will be 15. */
	playerLimit: 50,
	/**
	 * Used to prevent unknown players from joining.
	 * Can only contain characters a-z A-Z 0-9
	 * Note: If "env", joinCode will be taken from .env file.
	 * P.S. Place "env" and write joinCode in .env file instead if you using glitch.com.
	 */
	joinCode: "CodeForJoiningToServer",
	/**
	 * Port on which the websocket server will be launched.
	 * Note: If 0 specified, process.env.PORT will be used.
	 * P.S. Place 0 if you using glitch.com.
	 */
	webSocketPort: 5001,
	/**
	 * Higher value reduces latency, but also reduces maximum available players ping value.
	 * For example if TPS is 1 (radar will updates every second), max player ping is 1000. If TPS is 4 (radar will updates 4 times in second), max player ping is 250.
	 * So I recommend using a value of 2, there is no need for excessive precision.
	 */
	ticksPerSecond: 2
}