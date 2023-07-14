import { config } from "../config";
import { colorList as softColorList } from "./softColorList.json";
import { IWebSocket } from "./types/IWebSocket";
import { IPlayer } from "./types/IPlayer";
import { Server as WSServer } from "ws";

//* FUNCTIONS AND VARIABLES
const rnd = (a:number, b?:number) => Math.floor(Math.random() * (b ? b - a : a ?? 2)) + (b ? a : 0);

const colToNumber = (c:string) => parseInt(c.slice(1), 16);

const scaleNumber = (x:number, origin:number[], target:number[]) =>
	(x - origin[0]) * (target[1] - target[0]) / (origin[1] - origin[0]) + target[0];

const wsList:IWebSocket[] = [];
let playerCount = 0;
let closeList:number[] = [];

const createPlayer = () => {
	const player:IPlayer = {
		id: wsList.findIndex(v => typeof v == "undefined"),
		color: "",
		pos: { x: NaN, y: NaN, }
	}

	if (player.id == -1) player.id = wsList.length;

	if (config.colorMode == "palette") {
		const freeColorList = softColorList.filter(c => !wsList.some(v => v.player.color == c));
		player.color = freeColorList[rnd(freeColorList.length)];
	} else {
		do {
			player.color = "#" + rnd(0xFFFFFF).toString(16).padStart(6, "0");
		} while (wsList.some(v => v.player.color == player.color));
	}

	return player;
}



//* CONFIG CHECKS
if (config.colorMode != "palette" && config.colorMode != "random")
	throw new Error("Unknown colorMode please use \"palette\" or \"random\" instead.");

if (!Number.isInteger(config.playerLimit) || config.playerLimit < 2)
	throw new Error("\"playerLimit\" is not valid, must be atleast 2.");
if (config.playerLimit > 15 && config.colorMode == "palette") {
	console.log(`WARNING: "playerLimit" set to ${config.playerLimit}, but "colorMode" is "palette". Setting playerLimit to 15.`);
	config.playerLimit = 15;
}

if (config.joinCode.length < 8)
	throw new Error("\"joinCode\" must have atleast 8 symbols.");
if (!/^[a-zA-Z0-9]+$/.test(config.joinCode))
	throw new Error("\"joinCode\" can contain only chars a-z A-Z 0-9");

if (!Number.isInteger(config.webSocketPort))
	throw new Error("\"webSocketPort\" is not valid.");

if (!Number.isInteger(config.ticksPerSecond))
	throw new Error("\"ticksPerSecond\" is not valid.");
if (config.ticksPerSecond > 8)
	console.log(`WARNING: "ticksPerSecond" set to ${config.ticksPerSecond}, so players with ping ${Math.floor(1000 / config.ticksPerSecond)} or above will be disconnected.`);



const wss = new WSServer({ port: config.webSocketPort }, () => console.log("WebSocket Server is started at port " + config.webSocketPort));

const sendAll = (data:Buffer | string) => { for (const ws of wsList) ws?.send(data); }



wss.on("connection", (ws:IWebSocket) => {
	// Trying to immediately close ws if the player limit is reached.
	if (playerCount >= config.playerLimit) return ws.close(4002);

	ws.once("message", (data:Buffer) => {
		// Closing ws if the player limit is reached.
		if (playerCount >= config.playerLimit) return ws.close(4002);
		// Closing ws if joinCode incorrect
		if (data.toString("utf8") != config.joinCode) return ws.close(4001);
		
		// Creating and saving new player
		ws.player = createPlayer();
		wsList[ws.player.id] = ws;
		playerCount++;
		
		// Creating payload to notify every player (except current) that new player has joined.
		const updatePayload = Buffer.allocUnsafe(5);
		updatePayload[0] = 0;
		updatePayload[1] = ws.player.id;
		updatePayload.writeUIntBE(colToNumber(ws.player.color), 2, 3);
		
		for (const ows of wsList) {
			if (ows && ows.player.id != ws.player.id) ows.send(updatePayload);
		}

		// Adding every other player to payload and send this to current player.
		const initPayload = Buffer.allocUnsafe(1 + playerCount * 4);
		updatePayload.copy(initPayload);

		for (let i = 0, bi = 5; i < wsList.length; i++) {
			const player = wsList[i]?.player;
			if (!player || ws.player.id == player.id) continue;
			initPayload[bi] = player.id;
			initPayload.writeUIntBE(colToNumber(player.color), bi + 1, 3);
			bi += 4;
		}

		ws.send(initPayload);

		// Handling a message with the player's position
		ws.on("message", (data:Buffer) => {
			if (!data.length) return ws.player.pos = { x: NaN, y: NaN };
			ws.player.pos = { x: data[0], y: data[1] }
		});

		ws.once("close", () => { delete wsList[ws.player.id]; playerCount--; closeList.push(ws.player.id); });
	});
})

wss.once("error", e => { throw new Error(e.message); });



//* RADAR TICK

setInterval(() => {
	// Clearing player positions and requesting new ones
	for (const ws of wsList) {
		if (!ws) continue;
		ws.player.pos = { x: -1, y: -1 }
		// We will catch response in other place
		ws.send([1]);
	}

	// Set a timeout so players have time to respond.
	setTimeout(() => {
		const posPayload = Buffer.allocUnsafe(2 + closeList.length + wsList.filter(v => v?.player?.pos?.x > -1).length * 3);
		posPayload[0] = 2;
		posPayload[1] = closeList.length;

		// Adding info about disconnected users to payload
		for (let i = 0; i < closeList.length; i++) posPayload[2 + i] = closeList[i];
		let i = 2 + closeList.length;
		closeList = [];
		

		for (const ws of wsList) {
			if (!ws) continue;
			// If the player does not responds, then he has a high ping, so we need to disconnect him
			if (ws.player.pos.x == -1) { ws.close(4003); continue; }

			posPayload[i] = ws.player.id;
			posPayload[i + 1] = ws.player.pos.x;
			posPayload[i + 2] = ws.player.pos.y;
			i += 3;
		}

		sendAll(posPayload);
	}, 1000 / config.ticksPerSecond);
}, 1000 / config.ticksPerSecond)