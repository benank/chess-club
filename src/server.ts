import { Server, Socket } from "socket.io";
import dotenv from "dotenv";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

dotenv.config();

const PORT = parseInt(process.env.PORT ?? "5000");
const io = new Server(PORT);

io.on("test", (args: any) => {
    console.log(`test event ${args}`);
});

io.on(
    "connection",
    (
        socket: Socket<
            DefaultEventsMap,
            DefaultEventsMap,
            DefaultEventsMap,
            any
        >
    ) => {
        console.log(`connection: `, socket.id);

        socket.on('test', (args: any) => {
            console.log(`test event here ${args}`);
        })

        socket.emit('testfunc', 'hello from server')
    }
);

console.log(`Server listening on port ${PORT}...`);
