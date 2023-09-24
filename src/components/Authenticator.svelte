<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { createClient } from '@supabase/supabase-js';

  const supabase = createClient(
    'https://pyamttwvpgnenxtwmire.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5YW10dHd2cGduZW54dHdtaXJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTU0MjQwNzUsImV4cCI6MjAxMTAwMDA3NX0.WakCsaS4FyiOGMHtBEed-lc9ZI2HK-LNQK9WgOeQvbI'
  );

  const dispatch = createEventDispatcher();

  const OAUTH_TOKEN_KEY = 'repo-size-oauth-token';
  const GITHUB_TOKEN_KEY = 'x-github-token';

  let storage: chrome.storage.SyncStorageArea;
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
    console.log('mounted');
    if (typeof chrome !== 'undefined') {
      storage = chrome.storage.sync || chrome.storage.local;
    }
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
    await supabase.auth
      .signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: 'https://aminoffz.github.io/',
        },
      })
      .then((res) => {
        if (res.data.url) {
          console.log(res.data.url);
          chrome.runtime.sendMessage({
            action: 'authenticate',
            data: res.data.url,
          });
        }
      })
      .catch((err) => {
        console.log(err);
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
<div class="pb-4 flex justify-center items-center gap-1">
  <div>Calls remaining:</div>
  {#if rate}
    <div>{rate?.remaining}</div>
  {:else}
    <div>0</div>
  {/if}
</div>
