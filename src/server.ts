import { Server as SocketServer, Socket } from "socket.io";
import dotenv from "dotenv";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import {
    CONFIRM_OPPONENT,
    PHYSICAL_MAKE_MOVE,
    PHYSICAL_MOVE_MADE,
    SERVER_SYNC_ALL,
    START_RECORDING,
    STOP_RECORDING,
    SYNC_ONLINE_BOARD_STATE,
    SYNC_PHYSICAL_MOVE_TO_ONLINE,
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
    private _opponentMoveConfirmed: boolean = true;

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
                socket.on(CONFIRM_OPPONENT, this.onConfirmOpponent.bind(this));
            }
        );
        this._log(`Server listening on port ${PORT}...`);
    }

    @performanceCatch
    private onConfirmOpponent() {
        this._opponentMoveConfirmed = true;
        this.sync();
    }

    @performanceCatch
    private onOnlineBoardSync(gameStateStr: string) {
        const lastHistoryLength = this._onlineGameState.history({
            verbose: true,
        }).length;
        const gameState = JSON.parse(gameStateStr) as WizardGameState;
        this._onlineGameState = new Chess();
        this._onlineGameState.loadPgn(gameState.pgn);
        this._log(this._onlineGameState.pgn());

        const newHistory = this._onlineGameState.history({ verbose: true });

        if (
            newHistory.length !== lastHistoryLength &&
            newHistory[newHistory.length - 1].color !== this._mySide
        ) {
            this._opponentMoveConfirmed = false;
        }

        this._mySide = gameState.mySide;
        this._time = gameState.time;
        this.sync();
    }

    @performanceCatch
    private onPhysicalGameMakeMove(move: string) {
        this._io.emit(PHYSICAL_MOVE_MADE, move);
        const board = new Chess();
        board.loadPgn(this._onlineGameState.pgn());
        try {
            const moveObject = board.move(move);
            // No errors = valid move
            this._isLastMoveInvalid = false;
            this._io.emit(
                SYNC_PHYSICAL_MOVE_TO_ONLINE,
                JSON.stringify(moveObject)
            );
        } catch (err) {
            console.log(`Invalid move: ${move}`);
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
            pgn: this._onlineGameState.pgn(),
            isRecording: this._isRecording,
            isLastMoveInvalid: this._isLastMoveInvalid,
            mySide: this._mySide,
            time: this._time,
            opponentMoveConfirmed: this._opponentMoveConfirmed,
        };
    }

    @performanceCatch
    private sync() {
        this._io.emit(SERVER_SYNC_ALL, JSON.stringify(this.getGameState()));
    }
}

const server = new Server();
