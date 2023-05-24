<script lang="ts">
	import type { LabelType } from '$lib/models';

    export let small = false;
    export let reversed = true;
    export let vertical = true;
	export let type: LabelType = 'numbers';
	const values =
		type === 'letters'
			? ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
			: ['1', '2', '3', '4', '5', '6', '7', '8'];
</script>

<div class={`label-container ${vertical ? 'vertical' : ''} ${reversed ? 'reversed' : ''} ${small ? 'small' : ''}`}>
	{#each values as v}
		<div>{v}</div>
	{/each}
</div>

<style>
    div.label-container {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
		font-size: 2.5rem;
        height: 100%;
        width: 100%;
        align-items: center;
        text-shadow: 0 0 2px rgba(0, 0, 0, 1), 0 0 6px rgba(0, 0, 0, 0.5);
    }
    
    div.label-container.small {
        font-size: 1.25rem;
    }
    
    div.label-container.reversed {
        flex-direction: row-reverse;
    }
    
    div.label-container.vertical {
        flex-direction: column;
    }
    
    div.label-container.vertical.reversed{
        flex-direction: column-reverse;
    }
</style>