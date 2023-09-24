<script lang="ts">
  export let tokenValid = false;
</script>

<h2
  class="{tokenValid
    ? 'text-ctp-green'
    : 'text-ctp-red'} select-none pb-2 whitespace-nowrap text-center text-xl font-bold"
>
  Token
</h2>
