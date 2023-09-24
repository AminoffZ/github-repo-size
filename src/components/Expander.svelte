<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let expanded = false;

  const dispatch = createEventDispatcher();

  function toggle() {
    dispatch('toggle');
    console.log('toggle');
  }
</script>

<div class="flex justify-center">
  <button
    class="flex justify-center w-full hover:bg-ctp-crust"
    on:click={toggle}
  >
    <svg
      class="arrow {expanded
        ? 'arrow-up'
        : 'arrow-down'} h-10 w-10 fill-ctp-text"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      ><title>chevron-down</title><path
        d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"
      /></svg
    >
  </button>
</div>

<style>
  .arrow {
    transition: transform 0.5s ease-in-out;
  }
  .arrow-up {
    transform: rotateX(180deg);
  }
</style>
