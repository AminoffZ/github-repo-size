<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { getToken } from '../shared';

  const dispatch = createEventDispatcher();

  let rate:
    | {
        limit: number;
        remaining: number;
        reset: number;
        used: 0;
        resource: string;
      }
    | undefined;

  $: rate;

  onMount(async () => {
    await testToken();
  });

  async function testToken() {
    const token = await getToken();
    const headers: { [key: string]: any } = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await fetch('https://api.github.com/rate_limit', {
      headers: headers,
    });
    res.json().then((data) => {
      rate = data.rate;
    });
    if (res.status === 200 && token) {
      dispatch('tokenStatus', true);
    }
  }

  async function signInWithGithub() {
    chrome.runtime.sendMessage({
      action: 'authenticate',
      data: 'https://pyamttwvpgnenxtwmire.supabase.co/auth/v1/authorize?provider=github&redirect_to=https%3A%2F%2Faminoffz.github.io%2Fgithub-repo-size%2Fauth',
    });
  }
</script>

<div class="pb-1 flex justify-center items-center">
  <button
    on:click={signInWithGithub}
    class="rounded px-3 py-1 font-extrabold text-xl bg-ctp-crust"
    >Authenticate</button
  >
</div>
<div class="pb-3 flex justify-center items-center gap-1">
  <div>Calls remaining:</div>
  {#if rate}
    <div>{rate?.remaining}</div>
  {:else}
    <div>0</div>
  {/if}
</div>
