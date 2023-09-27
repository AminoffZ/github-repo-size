import { storage } from '../shared';

storage.get('grs-installed', (result) => {
  if (result && result['grs-installed'] === true) {
  } else {
    chrome.tabs.create({
      url: 'https://aminoffz.github.io/github-repo-size',
    });
    storage.set({
      'grs-installed': true,
    });
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    tab.url &&
    tab.url.startsWith(
      'https://aminoffz.github.io/github-repo-size/auth/#access_token='
    )
  ) {
    // Extract the token from the URL.
    const url: URL = new URL(tab.url);
    const providerTokenParam: string | undefined = url.hash
      .split('&')
      .find((param) => param.startsWith('provider_token='));
    const providerToken: string | undefined = providerTokenParam?.split('=')[1];

    if (providerToken) {
      storage.set({
        'repo-size-oauth-token': providerToken,
      });
    }
  }
});

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === 'authenticate') {
    chrome.tabs.create({
      url: request.data,
    });
  }
});
