<script lang='ts'>
    import '../reset.css';
    import ChatSection from "../components/ChatSection.svelte";
    import ChessboardSection from "../components/ChessboardSection.svelte";
    import IndicatorsSection from "../components/IndicatorsSection.svelte";
</script>

<main>
    <IndicatorsSection />
    <ChessboardSection />
    <ChatSection />
</main>

<style>
    main {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        width: 90vw;
        height: 100vh;
        display: grid;
        grid-template-columns: 1fr 3fr 1fr;
        background-color: black;
        font-family: 'Montserrat Thin';
        color: white;
        overflow: hidden;
        /* border: 2px solid red; */
    }
</style>