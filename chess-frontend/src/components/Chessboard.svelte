<script lang="ts">
	import GameManager from '../lib/gamemanager';
	import { gameStateStore } from '$lib/store';
	import {
		getChessPositionFromIndex,
		getLastMove,
		getLastMoveVerbose,
		getOtherSide,
		getTileColor
	} from '$lib/utils';
	import { Chess, type Move } from 'chess.js';

	let chess: Chess = new Chess();
	let opponentLastMove: Move | undefined;

	$: {
		chess = new Chess();
		chess.loadPgn($gameStateStore?.pgn ?? '');
	}

	$: opponentLastMove = getLastMoveVerbose(chess, getOtherSide($gameStateStore?.mySide));
	$: myLastMove = getLastMoveVerbose(chess, $gameStateStore?.mySide);

	const shouldTileHighlightForMove = (
		position: string,
		opponentMoveConfirmed: boolean | undefined,
		lastMove: Move | undefined
	): boolean => {
		if (opponentMoveConfirmed) {
			return false;
		}

		return position === lastMove?.from || position === lastMove?.to;
	};
</script>

<div class={`chessboard ${$gameStateStore?.mySide === 'b' ? 'flipped' : ''}`}>
	{#each new Array(64) as _, index}
		<div
			class={`space ${getTileColor(index)} ${getChessPositionFromIndex(index)} ${
				shouldTileHighlightForMove(
					getChessPositionFromIndex(index),
					$gameStateStore?.opponentMoveConfirmed,
					opponentLastMove
				)
					? 'highlight'
					: ''
			} ${
				shouldTileHighlightForMove(
					getChessPositionFromIndex(index),
					false,
					myLastMove
				)
					? 'green-highlight'
					: ''
			}`}
		/>
	{/each}
</div>

<style>
	div.chessboard {
		place-self: center;
		width: 100%;
		max-width: 90vh;
		max-height: 90vh;
		aspect-ratio: 1 / 1;
		display: grid;
		grid-template-columns: repeat(8, 1fr);
		grid-template-rows: repeat(8, 1fr);
		background-color: rgba(255, 255, 255, 0.5); /* Add spotlight to chess board */
	}

	div.chessboard.flipped {
		transform: rotate(180deg);
	}

	div.space {
		background-color: #f0d9b5;
		opacity: 0; /* Change to 1 to see the board for testing */
	}

	div.space.dark {
		background-color: #b58863;
	}

	div.space.green-highlight {
		background-color: #1eff00;
		animation: 1s linear green-highlight forwards;
	}
	
	@keyframes green-highlight {
		0% {
			opacity: 0;
		}
		10% {
			opacity: 1;
		}
		90% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}
	
	div.space.highlight {
		background-color: yellow;
		animation: 1s ease-in-out highlight infinite;
	}

	@keyframes highlight {
		0% {
			opacity: 1;
		}
		50% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
</style>
