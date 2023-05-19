<script>
	import { gameStateStore } from '$lib/store';
	import { Chess } from 'chess.js';

	$: chess = new Chess($gameStateStore?.fen);
	$: history = chess.history();

	const getLastOpponentMove = () => {
		if (history.length == 0) {
			return '';
		}

		return history[history.length - 1];
	};

	const getLastMyMove = () => {
		if (history.length == 0) {
			return '';
		}

		return history[history.length - 1];
	};
</script>

<div class="grid">
	<div class="section">
		<div class="clock">{$gameStateStore?.time?.opponent ?? '00:00'}</div>
		<div class="move">
			{#if $gameStateStore?.isRecording}
				<div class="indicator" style="--color: yellow;" />
			{/if}
			{getLastOpponentMove()}
		</div>
	</div>
	<div class="section bottom">
		<div class="clock active">{$gameStateStore?.time?.mine ?? '00:00'}</div>
		<div class="move">
			{#if $gameStateStore?.isRecording}
				<div class="indicator" style="--color: red;" />
			{/if}
			{getLastMyMove()}
		</div>
	</div>
</div>

<style>
	div.grid {
		display: grid;
		grid-template-rows: 1fr 1fr;
		font-size: 5rem;
		text-align: center;
		font-weight: 500;
	}

	div.section {
		display: flex;
		flex-direction: column;
		padding: 2rem 0;
		align-items: center;
		gap: 2rem;
	}

	div.section.bottom {
		flex-direction: column-reverse;
	}

	div.clock {
		background-color: rgba(255, 255, 255, 0.15);
		width: fit-content;
		padding: 1rem 1rem;
		min-width: 3em;
		border-radius: 1rem;
	}

	div.clock.active {
		background-color: rgba(0, 255, 0, 0.15);
		border: 4px solid rgba(0, 255, 0, 1);
	}

	div.move {
		position: relative;
		font-size: 4rem;
		width: 100%;
	}

	div.indicator {
		position: absolute;
		left: 1rem;
		top: 50%;
		transform: translateY(-50%);
		width: 2.5rem;
		aspect-ratio: 1 / 1;
		color: var(--color);
		background-color: var(--color);
		border-radius: 500px;
		box-shadow: 0 0 10px var(--color), 0 0 30px var(--color);
	}
</style>
