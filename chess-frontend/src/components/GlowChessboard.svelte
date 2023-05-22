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

	$: {
		chess = new Chess();
		chess.loadPgn($gameStateStore?.pgn ?? '');
	}

	$: reversedLabels = $gameStateStore?.mySide === 'b';
	$: myTurn = chess.turn() === $gameStateStore?.mySide;
</script>

<div class={`chessboard ${$gameStateStore?.mySide === 'b' ? 'flipped' : ''}`}>
	{#each new Array(64) as _, index}
		<div class={`space ${getTileColor(index)} ${getChessPositionFromIndex(index)}`} />
	{/each}
	<div class="labels left">
		<Labels reversed={!reversedLabels} small={true} />
	</div>
	<div class="labels bottom">
		<Labels type={'letters'} vertical={false} reversed={reversedLabels} small={true} />
	</div>
	<div class={`clock top ${!myTurn ? 'active' : ''}`}>00:00</div>
	<div class={`clock bottom ${myTurn ? 'active' : ''}`}>00:00</div>
</div>

<style>
	div.chessboard {
		position: relative;
		place-self: center;
		width: 100%;
		max-width: 60vh;
		max-height: 60vh;
		aspect-ratio: 1 / 1;
		display: grid;
		grid-template-columns: repeat(8, 1fr);
		grid-template-rows: repeat(8, 1fr);
        isolation: isolate;
	}

	div.chessboard.flipped {
		transform: rotate(180deg);
	}

	div.clock {
        position: absolute;
		background-color: rgba(255, 255, 255, 0.15);
		width: fit-content;
		padding: 1rem 1rem;
		min-width: 3em;
		border-radius: 1rem;
		font-size: 3rem;
		text-align: center;
		font-weight: 500;
	}
    
    div.clock.top {
        top: -2rem;
        right: 0;
        transform: translateY(-100%);
    }
    
    div.clock.bottom {
        bottom: -2rem;
        left: 0;
        transform: translateY(100%);
    }

	div.clock.active {
		background-color: rgba(0, 255, 0, 0.15);
		outline: 4px solid rgba(0, 255, 0, 1);
	}
    
	div.labels {
		position: absolute;
		top: -1.5rem;
		height: 100%;
        margin: 4px;
	}

	div.labels.left {
		left: 0;
	}

	div.labels.bottom {
		height: fit-content;
		width: 100%;
		right: -1.5rem;
		bottom: 0;
		top: unset;
	}

	div.space {
		background-color: rgba(0, 240, 255, 1);
        box-shadow: 0px 0px 48px 8px rgba(0, 240, 255, 0.5);
	}

	div.space.dark {
		background-color: black;
        z-index: -1;
	}
</style>
