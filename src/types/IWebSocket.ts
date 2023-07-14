import { WebSocket } from "ws";
import { IPlayer } from "./IPlayer";

export interface IWebSocket extends WebSocket { player: IPlayer }