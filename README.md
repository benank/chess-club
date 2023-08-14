# Chess Club

Sync physical chess to digital chess.

This allows you to use a physical chess board (nothing special) and play online chess on [chess.com](https://chess.com). It does this using 4 parts:
 - A main server that syncs data between components
 - A automated version of Chrome that moves your pieces for you and obtains the current game state (eg. where all the pieces are)
 - A local voice recognition client to recognize where you moved your pieces on the physical board based on what you say (eg. bE3)
 - A front end client to display this information to yourself and viewers watching, if you're livestreaming. There are two parts to the front end: one for an overheard projector to display on top of your chess board (http://localhost:5173/) and the other to display the current game state to anyone watching online (http://localhost:5173/board). 

## Setting up

1. Create a `.env` file with the following contents:
```
CHESS_USERNAME=YOUR_CHESSCOM_USERNAME
CHESS_PASSWORD=YOUR_CHESSCOM_PASSWORD
PORT=7870
PICOVOICE_ACCESS_KEY=YOUR_ACCESS_KEY
```

`CHESS_USERNAME` and `CHESS_PASSWORD` are from your [chess.com](https://chess.com) account. You can leave `PORT` as-is, and `PICOVOICE_ACCESS_KEY` is your access key from https://picovoice.ai/.

2. Run `npm install` to install required dependencies.

## Starting Everything

Run these commands in order:


1. `npm run start:server` to start the server.
2. `npm run start:wizard` to start the wizard, which creates a browser that observes the chess game, reports back the chess game state, and can interact with the chess game using information from the server (eg. when a physical piece is moved).
3. `npm run start:voice` to start the voice client, which listens for keypresses from the numpad to start voice recording and recognition. This is used for telling the system where a piece was moved so the computer can move it online.
4. `npm run start:frontend` to start the frontend display, which receives information from the server about the chess game state and displays graphics and animations based on the information (eg. flashes where to move opponent's pieces).

### Numpad setup

To ensure that you can make things move along using your numpad, bind these keys:
 - Start voice recording for making a move: F21
 - Confirm that you have moved the opponent's piece: F16
 - Start voice recording for listing possible moves for a piece: F17
 - Start a new game: F18 

## Video of example setup

In the video below, I share my livestream setup using this software. I'm able to play chess with anyone on the internet using my physical chess board. No need for screens! I'm also using a remapped wireless numpad to control specific aspects of the stream and game. I'm using a projector mounted above 

[![Chess Club Setup](https://img.youtube.com/vi/UcF7Ya1CMQY/0.jpg)](https://www.youtube.com/watch?v=UcF7Ya1CMQY)

Below, you can view my first livestream using this setup. While there were a couple bugs, it still worked pretty well (although it takes a while to complete a move!😅).

[![Chess Club Lviestream](https://img.youtube.com/vi/GuRKL34j9Vw/0.jpg)](https://youtu.be/GuRKL34j9Vw?t=339)