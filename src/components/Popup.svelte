<script lang="ts">
  import Authenticator from './Authenticator.svelte';
  import Expander from './Expander.svelte';
  import PopupTitle from './PopupTitle.svelte';
  import TokenInput from './TokenInput.svelte';
  import TokenStatus from './TokenStatus.svelte';

  $: expanded = false;
  $: tokenValid = false;

  function toggleExpanded() {
    expanded = !expanded;
  }
</script>

<PopupTitle />
<TokenStatus {tokenValid} />
<Authenticator on:tokenStatus={(event) => (tokenValid = event.detail)} />
<TokenInput {expanded} />
<Expander {expanded} on:toggle={toggleExpanded} />
