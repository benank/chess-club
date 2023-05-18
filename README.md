# Chess Club

Sync physical chess to digital chess.

## Starting Everything

Run these commands in order:


1. `npm run start:server` to start the server.
2. `npm run start:wizard` to start the wizard, which creates a browser that observes the chess game, reports back the chess game state, and can interact with the chess game using information from the server (eg. when a physical piece is moved).
3. `npm run start:voice` to start the voice client, which listens for keypresses from the numpad to start voice recording and recognition. This is used for telling the system where a piece was moved so the computer can move it online.
4. `npm run start:frontend` to start the frontend display, which receives information from the server about the chess game state and displays graphics and animations based on the information (eg. flashes where to move opponent's pieces).


## Test FENs

https://lichess.org/editor

