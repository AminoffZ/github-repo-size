<script lang="ts">
  import { onMount } from 'svelte';
  import Expander from './Expander.svelte';
  import PopupTitle from './PopupTitle.svelte';
  import TokenInput from './TokenInput.svelte';
  import TokenStatus from './TokenStatus.svelte';

  const GITHUB_TOKEN_KEY = 'x-github-token';

  let storage: chrome.storage.SyncStorageArea;

  $: expanded = false;
  $: tokenEnabled = false;

  onMount(async () => {
    console.log('mounted');
    if (typeof chrome !== 'undefined') {
      console.log(chrome.storage);
      storage = chrome.storage.sync || chrome.storage.local;
    }
  });

  function toggleExpanded() {
    expanded = !expanded;
  }

  function toggleTokenEnabled() {
    tokenEnabled = !tokenEnabled;
  }
</script>

<PopupTitle />
<TokenStatus {tokenEnabled} />
<TokenInput on:toggle={toggleTokenEnabled} {expanded} />
<Expander on:toggle={toggleExpanded} {expanded} />

<style>
</style>
