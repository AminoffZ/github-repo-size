<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { OAUTH_TOKEN_KEY, GITHUB_TOKEN_KEY } from '../constants';
  import { storage } from '../constants';

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
    const oauthToken: { [key: string]: any } = await checkOAuthToken();
    const githubToken: { [key: string]: any } = await checkGithubToken();
    testToken(githubToken[GITHUB_TOKEN_KEY] || oauthToken[OAUTH_TOKEN_KEY]);
  });

  async function testToken(token: string) {
    const headers: { [key: string]: any } = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await fetch('https://api.github.com/rate_limit', {
      headers: headers,
    });
    console.log(res);
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

  async function checkOAuthToken() {
    return await storage.get(OAUTH_TOKEN_KEY);
  }

  async function checkGithubToken() {
    return await storage.get(GITHUB_TOKEN_KEY);
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
