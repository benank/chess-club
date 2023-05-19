<script lang='ts'>
    import '../reset.css';
    import ChatSection from "../components/ChatSection.svelte";
    import ChessboardSection from "../components/ChessboardSection.svelte";
    import IndicatorsSection from "../components/IndicatorsSection.svelte";
</script>

<main>
    <ChatSection />
    <ChessboardSection />
    <IndicatorsSection />
</main>

<style>
    main {
        width: 100vw;
        height: 100vh;
        display: grid;
        grid-template-columns: 1fr 3fr 1fr;
        background-color: black;
        font-family: 'Montserrat Thin';
        color: white;
    }
</style>