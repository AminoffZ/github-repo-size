<script lang="ts">
  import { onMount } from 'svelte';
  import Expander from './Expander.svelte';
  import PopupTitle from './PopupTitle.svelte';
  import TokenInput from './TokenInput.svelte';
  import TokenStatus from './TokenStatus.svelte';

  const GITHUB_TOKEN_KEY = 'x-github-token';

  import { createClient } from '@supabase/supabase-js';

  const supabase = createClient(
    'https://pyamttwvpgnenxtwmire.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5YW10dHd2cGduZW54dHdtaXJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTU0MjQwNzUsImV4cCI6MjAxMTAwMDA3NX0.WakCsaS4FyiOGMHtBEed-lc9ZI2HK-LNQK9WgOeQvbI'
  );

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

  $: expanded = false;
  $: tokenEnabled = false;
  $: rate;

  onMount(async () => {
    console.log('mounted');
    if (typeof chrome !== 'undefined') {
      storage = chrome.storage.sync || chrome.storage.local;
    }
    const user = await checkUser();
    const token: { [key: string]: any } = await checkToken();
    if (token && token[GITHUB_TOKEN_KEY]) {
      testToken(token[GITHUB_TOKEN_KEY]);
    }
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
      tokenEnabled = true;
    }
  }

  function toggleExpanded() {
    expanded = !expanded;
  }

  function toggleTokenEnabled() {
    tokenEnabled = !tokenEnabled;
  }

  async function checkToken() {
    return await storage.get(GITHUB_TOKEN_KEY);
  }

  async function checkUser() {
    return await supabase.auth.getSession();
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

  async function signOut() {
    await supabase.auth.signOut();
  }
</script>

<PopupTitle />
<TokenStatus {tokenEnabled} />
<div class="pb-3 flex justify-center items-center">
  <button
    on:click={signInWithGithub}
    class="rounded p-2 font-extrabold text-xl bg-ctp-crust"
    >Sign in with GitHub</button
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
