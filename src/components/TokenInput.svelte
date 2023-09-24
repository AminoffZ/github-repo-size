<script lang="ts">
  import { onMount } from 'svelte';
  import { GITHUB_TOKEN_KEY } from '../constants';
  import { storage } from '../constants';

  export let expanded = false;

  let token = '';
  $: tokenValid = token.match(/^github_pat_[a-zA-Z0-9]{22}_[a-zA-Z0-9]{59}$/);
  let showToken = false;

  const readStorage = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      storage.get([GITHUB_TOKEN_KEY], function (result) {
        if (result[GITHUB_TOKEN_KEY] === undefined) {
          reject('Token not found');
        } else {
          resolve(result[GITHUB_TOKEN_KEY]);
        }
      });
    });
  };

  async function getGithubToken() {
    return await readStorage();
  }

  async function setGithubToken() {
    const obj: { [key: string]: string } = {};
    obj[GITHUB_TOKEN_KEY] = token;
    await storage
      .set(obj)
      .then(() => {
        console.log('Token set to ' + token);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  onMount(async () => {
    await getGithubToken()
      .then((_token) => {
        console.log('Token: ' + _token);
        if (typeof _token === 'string') token = _token;
      })
      .catch((err) => {
        console.error(err);
      });
  });
</script>

<div
  class="flex flex-col gap-3 justify-center items-center token-dropdown {expanded
    ? 'h-28'
    : 'h-0'} overflow-hidden"
>
  <div
    class="{tokenValid
      ? 'text-ctp-green'
      : 'text-ctp-red'}  flex justify-center items-center"
  >
    {#if showToken}
      <input
        bind:value={token}
        class="bg-ctp-crust form-input pl-4 pr-12 py-3 rounded-full"
        type="text"
        name="token"
        id="token"
      />
    {:else}
      <input
        bind:value={token}
        class="bg-ctp-crust form-input pl-4 pr-12 py-3 rounded-full"
        type="password"
        name="token"
        id="token"
      />
    {/if}
    <button
      class="eye {expanded
        ? 'eye-expanded'
        : 'eye-hidden'} rounded-full absolute translate-x-24
      "
      on:click={() => (showToken = !showToken)}
    >
      {#if showToken}
        <svg
          class="h-8 w-8 fill-ctp-text"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          ><title>eye-off</title><path
            d="M11.83,9L15,12.16C15,12.11 15,12.05 15,12A3,3 0 0,0 12,9C11.94,9 11.89,9 11.83,9M7.53,9.8L9.08,11.35C9.03,11.56 9,11.77 9,12A3,3 0 0,0 12,15C12.22,15 12.44,14.97 12.65,14.92L14.2,16.47C13.53,16.8 12.79,17 12,17A5,5 0 0,1 7,12C7,11.21 7.2,10.47 7.53,9.8M2,4.27L4.28,6.55L4.73,7C3.08,8.3 1.78,10 1,12C2.73,16.39 7,19.5 12,19.5C13.55,19.5 15.03,19.2 16.38,18.66L16.81,19.08L19.73,22L21,20.73L3.27,3M12,7A5,5 0 0,1 17,12C17,12.64 16.87,13.26 16.64,13.82L19.57,16.75C21.07,15.5 22.27,13.86 23,12C21.27,7.61 17,4.5 12,4.5C10.6,4.5 9.26,4.75 8,5.2L10.17,7.35C10.74,7.13 11.35,7 12,7Z"
          /></svg
        >
      {:else}
        <svg
          class="h-8 w-8 fill-ctp-text"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          ><title>eye</title><path
            d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"
          /></svg
        >
      {/if}
    </button>
  </div>
  <div class="flex justify-center items-center">
    <button
      disabled={!tokenValid}
      class="disabled:opacity-50 font-extrabold rounded text-base bg-ctp-crust px-3 py-1"
      on:click={setGithubToken}>Set Token</button
    >
  </div>
</div>

<style>
  .token-dropdown {
    transition: height 0.5s ease-in-out;
  }
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  .eye-expanded {
    opacity: 1;
    animation: fadeIn 1s forwards;
  }
  .eye-hidden {
    opacity: 0;
  }
  input {
    color: var(--tokenValid);
  }
</style>
