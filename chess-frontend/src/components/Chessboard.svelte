<script lang="ts">
	import GameManager from '../lib/gamemanager';
	import { gameStateStore, possibleMovesStore } from '$lib/store';
	import {
		getChessPositionFromIndex,
		getLastMove,
		getLastMoveVerbose,
		getOtherSide,
		getTileColor
	} from '$lib/utils';
	import { Chess, type Move } from 'chess.js';
	import Labels from './Labels.svelte';

	let chess: Chess = new Chess();
	let opponentLastMove: Move | undefined;

	$: {
		chess = new Chess();
		chess.loadPgn($gameStateStore?.pgn ?? '');
	}

	$: opponentLastMove = getLastMoveVerbose(chess, getOtherSide($gameStateStore?.mySide));
	$: myLastMove = getLastMoveVerbose(chess, $gameStateStore?.mySide);
	$: reversedLabels = $gameStateStore?.mySide === 'b';

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

	const shouldTileHighlightPossibleMove = (position: string, moves: string[]) => {
		return moves.includes(position);
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
				shouldTileHighlightForMove(getChessPositionFromIndex(index), false, myLastMove)
					? 'green-highlight'
					: ''
			} ${
				shouldTileHighlightPossibleMove(getChessPositionFromIndex(index), $possibleMovesStore)
					? 'lightblue-highlight'
					: ''
			}`}
		/>
	{/each}
	<div class="labels left">
		<Labels reversed={!reversedLabels} />
	</div>
	<div class="labels right">
		<Labels reversed={!reversedLabels} />
	</div>
	<div class="labels bottom">
		<Labels type={'letters'} vertical={false} reversed={reversedLabels} />
	</div>
	<div class="labels top">
		<Labels type={'letters'} vertical={false} reversed={reversedLabels} />
	</div>
</div>

<style>
	div.chessboard {
		position: relative;
		place-self: center;
		width: 100%;
		--size: 76.5vh;
		max-width: var(--size);
		max-height: var(--size);
		aspect-ratio: 1 / 1;
		display: grid;
		grid-template-columns: repeat(8, 1fr);
		grid-template-rows: repeat(8, 1fr);
		background-color: rgba(255, 255, 255, 0.5); /* Add spotlight to chess board */
	}

	div.chessboard.flipped {
		transform: rotate(180deg);
	}

	div.labels {
		position: absolute;
		top: 0;
		height: 100%;
	}

	div.labels.left {
		left: -3rem;
	}

	div.labels.right {
		right: -3rem;
	}

	div.labels.top {
		height: fit-content;
		width: 100%;
		left: 0;
		top: -3.5rem;
	}

	div.labels.bottom {
		height: fit-content;
		width: 100%;
		left: 0;
		bottom: -3.5rem;
		top: unset;
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

	div.space.lightblue-highlight {
		background-color: #00e1ff;
		animation: 5s linear lightblue-highlight forwards;
	}

	@keyframes lightblue-highlight {
		0% {
			opacity: 0;
		}
		5% {
			opacity: 1;
		}
		95% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
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
