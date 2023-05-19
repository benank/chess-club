import { Socket, io } from "socket.io-client";
import type { DisconnectDescription } from "socket.io-client/build/esm/socket";

export default class Client {
    private _socket: Socket;
    private _name: string;
    private _log: (...args: any[]) => void;

    constructor(name: string) {
        this._name = name;
        this._socket = io(`http://localhost:5173`);
        this._log = console.log.bind(console, `[Client: ${this._name}] `);

        this._socket.io.on("open", () => {
            this._log(`Connected!`);
        });

        this._socket.io.on("error", (err: Error) => {
            this._log(`Error: `, err);
        });
        
        this._socket.io.on(
            "close",
            (
                reason: string,
                description?: DisconnectDescription | undefined
            ) => {
                this._log(`Disconnected ${reason}`, description);
            }
        );
    }

    send(event: string, data?: any) {
        this._socket.emit(event, data);
    }
    
    on(ev: string, listener: (...args: any[]) => void) {
        this._socket.on(ev, listener);
    }
}