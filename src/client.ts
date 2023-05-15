import { io } from "socket.io-client";
import dotenv from "dotenv";
import {
    DisconnectDescription,
    Socket,
} from "socket.io-client/build/esm/socket";
dotenv.config();

export default class Client {
    private _socket: Socket;
    private _name: string;
    private _log: (...args: any[]) => void;

    constructor(name: string) {
        this._name = name;
        this._socket = io(`http://localhost:${process.env.PORT}`);
        this._log = console.log.bind(console, `[Client: ${this._name}] `);

        this._socket.io.on("open", () => {
            this._log(`open`);
        });

        this._socket.io.on("error", (err: Error) => {
            this._log(`error: `, err);
        });

        this._socket.io.on(
            "close",
            (
                reason: string,
                description?: DisconnectDescription | undefined
            ) => {
                this._log(`close ${reason}`, description);
            }
        );

        this._socket.on("testfunc", (args: any) => {
            this._log(`got data test func `, args);
        });
    }

    send(event: string, data: any) {
        this._socket.emit(event, data);
    }
}