import { Server as SocketServer, Socket } from "socket.io";
import dotenv from "dotenv";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import {
    PHYSICAL_MAKE_MOVE,
    SERVER_SYNC_ALL,
    START_RECORDING,
    STOP_RECORDING,
    SYNC_ONLINE_BOARD_STATE,
} from "./events";
import { Chess } from "chess.js";
import { GameState, Side, Time, WizardGameState } from "./models";
import { performanceCatch } from "./decorators";

dotenv.config();
const PORT = parseInt(process.env.PORT ?? "5000");

class Server {
    private _io: SocketServer;
    private _onlineGameState: Chess;
    private _log: (...args: any[]) => void;
    private _isRecording: boolean = false;
    private _isLastMoveInvalid: boolean = false;
    private _mySide: Side;
    private _time: Time;

    constructor() {
        this._log = console.log.bind(console, `[Server] `);
        this._onlineGameState = new Chess();

        this._io = new SocketServer(PORT);

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
                socket.on(
                    SYNC_ONLINE_BOARD_STATE,
                    this.onOnlineBoardSync.bind(this)
                );
                socket.on(
                    PHYSICAL_MAKE_MOVE,
                    this.onPhysicalGameMakeMove.bind(this)
                );
                socket.on(START_RECORDING, this.onStartRecording.bind(this));
                socket.on(STOP_RECORDING, this.onStopRecording.bind(this));
            }
        );
        this._log(`Server listening on port ${PORT}...`);
    }

    @performanceCatch
    private onOnlineBoardSync(gameStateStr: string) {
        const gameState = JSON.parse(gameStateStr) as WizardGameState;
        this._onlineGameState = new Chess(gameState.fen);
        this._log(this._onlineGameState.fen());
        this._mySide = gameState.mySide;
        this._time = gameState.time;
        this.sync();
    }

    @performanceCatch
    private onPhysicalGameMakeMove(move: string) {
        const board = new Chess(this._onlineGameState.fen());
        try {
            // TODO: move piece (eg. Q or n is case sensitive - need to determine what side I am)
            const moveObject = board.move(move);
            // No errors = valid move
            this._isLastMoveInvalid = false;
        } catch (err) {
            console.log(`onPhysicalGameMakeMove err: `, err);
            this._isLastMoveInvalid = true;
            this.sync();
            
            setTimeout(() => {
                this._isLastMoveInvalid = false;
                this.sync();
            }, 3000);
        }
    }

    @performanceCatch
    private onStartRecording() {
        this._isRecording = true;
        this.sync();
    }

    @performanceCatch
    private onStopRecording() {
        this._isRecording = false;
        this.sync();
    }
    
    @performanceCatch
    private getGameState(): GameState {
        return {
            fen: this._onlineGameState.fen(),
            isRecording: this._isRecording,
            isLastMoveInvalid: this._isLastMoveInvalid,
            mySide: this._mySide,
            time: this._time,
        };
    }

    @performanceCatch
    private sync() {
        this._io.emit(SERVER_SYNC_ALL, JSON.stringify(this.getGameState()));
    }
}

const server = new Server();
