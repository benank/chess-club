import type { Chess, Move } from 'chess.js';
import type { Side } from './models';

export const getOtherSide = (side: Side): Side => {
	return side == 'w' ? 'b' : 'w';
};

export const getLastMove = (chess: Chess, side: Side) => {
	const move = getLastMoveVerbose(chess, side);
	return move?.san ?? '';
};

export const getLastMoveVerbose = (chess: Chess, side: Side): Move | undefined => {
	const history = chess.history({ verbose: true });
	for (let i = history.length - 1; i >= 0; i--) {
		const move = history[i];
		if (move.color === side) {
			return move;
		}
	}
};

export const getTileColor = (index: number) => {
	const row = Math.floor(index / 8);
	const column = index % 8;
	const isEvenPosition = (row + column) % 2 === 0;
	return isEvenPosition ? 'light' : 'dark';
};

export const getChessPositionFromIndex = (index: number): string => {
	const column = String.fromCharCode(97 + (index % 8)); // Convert to letter ('a' to 'h')
	const row = 8 - Math.floor(index / 8); // Convert to number (1 to 8)
	return column + row;
}
