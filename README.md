# Chess Club

Sync physical chess to digital chess.

## Starting Everything

Run these commands in order:


1. `npm run start:server` to start the server.
2. `npm run start:wizard` to start the wizard, which creates a browser that observes the chess game, reports back the chess game state, and can interact with the chess game using information from the server (eg. when a physical piece is moved).
3. `npm run start:tron` to start tron, which uses the webcam stream to determine where pieces are on the physical board. If a piece is moved on the physical board, the state is updated and sent to the server.
4. `npm run start:display` to start the display, which receives information from the server about the chess game state and displays graphics and animations based on the information (eg. flashes where to move opponent's pieces).


## Test FENs

https://lichess.org/editor

