<script lang="ts">
	import Chessboard from './Chessboard.svelte';
	import { gameStateStore } from '$lib/store';
</script>

<div class="container">
	<Chessboard />
	{#if $gameStateStore?.isLastMoveInvalid}
		<div class="invalid-move">X</div>
	{/if}
</div>

<style>
	div.container {
		position: relative;
		display: grid;
		align-items: center;
	}

	div.invalid-move {
		position: absolute;
		place-self: center;
		color: red;
		font-size: 60rem;
		font-weight: 500;
		user-select: none;
		animation: 3s ease-in-out invalid forwards;
	}

	@keyframes invalid {
		0% {
			transform: scale(0);
		}
		10% {
			transform: scale(1);
		}
		90% {
			transform: scale(1);
		}
		100% {
			transform: scale(0);
		}
	}
</style>
