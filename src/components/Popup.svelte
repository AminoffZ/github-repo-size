<script lang="ts">
  import { onMount } from 'svelte';
  const GITHUB_TOKEN_KEY = 'x-github-token';
  const TOKEN_FEATURE_INFORMATION_KEY = 'user-knows-token-feature';
  let storage: any;
  onMount(() => {
    console.log('mounted');
    if (typeof chrome !== 'undefined') {
      console.log(chrome.storage);
      storage = chrome.storage.sync || chrome.storage.local;
    }
  });

  function setGithubToken(key: string, cb: () => void): void {
    const obj: { [key: string]: string } = {};
    obj[GITHUB_TOKEN_KEY] = key;

    storage.set(obj, function () {
      alert(
        'Your Github token has been set successfully. Reload the Github page to see changes.'
      );

      cb();
    });
  }

  const askGithubToken = (cb: () => void): void => {
    const githubToken: string | null = prompt('Please enter your Github token');

    if (githubToken === null) return;

    if (githubToken) {
      setGithubToken(githubToken, cb);
    } else {
      alert('You have entered an empty token.');
      cb();
    }
  };

  function handleOldGithubToken(
    cb: (error: any, askToSetToken?: boolean) => void
  ): void {
    storage.get(GITHUB_TOKEN_KEY, function (storedData: any) {
      const oldGithubToken = storedData[GITHUB_TOKEN_KEY];

      if (oldGithubToken) {
        if (
          confirm(
            'You have already set your Github token. Do you want to remove it?'
          )
        ) {
          storage.remove(GITHUB_TOKEN_KEY, function () {
            alert(
              'You have successfully removed Github token. Click extension icon again to set a new token.'
            );

            cb(null, false);
          });
        } else {
          cb(null, false);
        }
      } else {
        cb(null, true);
      }
    });
  }

  function handleTokenButton() {
    handleOldGithubToken((_, askToSetToken) => {
      if (askToSetToken) {
        askGithubToken(() => {});
      }
    });
  }
</script>

<div>
  <button on:click={handleTokenButton}>Add Token</button>
</div>
