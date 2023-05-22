<script>
	import '../../reset.css';
	import GlowChessboard from '../../components/GlowChessboard.svelte';
</script>

<main>
    <div class='overflow'>
        <div class="glowy-background" />
    </div>
	<GlowChessboard />
</main>

<style>
	main {
		width: 100vw;
		height: 100vh;
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: 1fr;
		place-items: center;
		background-color: black;
		font-family: 'Montserrat Thin';
		color: white;
		overflow: hidden;
        gap: 1rem;
	}
    
    div.overflow {
        width: 100vw;
        height: 100vh;
        position: absolute;
        top: 0;
        left: 0;
        overflow: hidden;
        display: grid;
    }

	div.glowy-background {
		position: absolute;
		place-self: center;
		width: 100vw;
        aspect-ratio: 1 / 1;
		opacity: 0.5;
		background: radial-gradient(rgba(0, 240, 255, 0.5), rgba(0, 240, 255, 0));
        animation: 10s ease-in-out glow infinite;
	}

	@keyframes glow {
		0% {
			opacity: 0.5;
		}
		50% {
			opacity: 0.25;
		}
		100% {
			opacity: 0.5;
		}
	}
</style>
