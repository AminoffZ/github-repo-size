<script lang="ts">
  import { onMount } from 'svelte';

  let counter = 0;
  onMount(() => {
    console.log('mounted');
  });
</script>

<div>
  <h1>hello</h1>
  <h1>yo</h1>
  <button on:click={() => counter++}>{counter}</button>
</div>
