<script lang="ts">
	import GameManager from '../lib/gamemanager';

	const getTileColor = (index: number) => {
		const row = Math.floor(index / 8);
		const column = index % 8;
		const isEvenPosition = (row + column) % 2 === 0;
		return isEvenPosition ? 'light' : 'dark';
	};
</script>

<div class="chessboard">
	{#each new Array(64) as _, index}
		<div class={`space ${getTileColor(index)}`} />
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
	}

	div.space {
		background-color: #f0d9b5;
	}

	div.space.dark {
		background-color: #b58863;
	}
</style>
