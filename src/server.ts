import { Server as SocketServer, Socket } from "socket.io";
import dotenv from "dotenv";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { SYNC_ONLINE_BOARD_STATE } from "./events";
import { Chess } from "chess.js";

dotenv.config();
const PORT = parseInt(process.env.PORT ?? "5000");

class Server {
    private _io: SocketServer;
    private _onlineGameState: Chess;
    private _log: (...args: any[]) => void;

    constructor() {
        this._log = console.log.bind(console, `[Server] `);
        this._onlineGameState = new Chess();

        this._io = new SocketServer(PORT);

        this._io.on("test", (args: any) => {
            this._log(`test event ${args}`);
        });

        this._io.on(
            "connection",
            (
                socket: Socket<
                    DefaultEventsMap,
                    DefaultEventsMap,
                    DefaultEventsMap,
                    any
                >
            ) => {
                this._log(`Connection: `, socket.id);
                socket.on(SYNC_ONLINE_BOARD_STATE, this.onOnlineBoardSync);
            }
        );
        this._log(`Server listening on port ${PORT}...`);
    }

    private onOnlineBoardSync(fen: string) {
        this._onlineGameState = new Chess(fen);
        this._log(this._onlineGameState.fen());
    }
}

const server = new Server();
