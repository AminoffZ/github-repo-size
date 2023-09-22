<script lang="ts">
  export let tokenEnabled = false;
</script>

<h2
  class="{tokenEnabled
    ? 'text-ctp-green'
    : 'text-ctp-red'} select-none pb-2 whitespace-nowrap text-center text-xl font-bold"
>
  Token
</h2>
