import { storage } from '../shared';

/**
 * Listen for navigation events and send a message to the content script
 * to update the DOM. This is needed because GitHub uses pushState to
 * navigate between pages. This means that the content script is not
 * reloaded when the user navigates to a new page. We need to send a
 * message to the content script to update the DOM. We only send the
 * message every other time to avoid sending the message twice when
 * navigating to a new page.
 * @see https://developer.chrome.com/docs/extensions/reference/webNavigation/#event-order
 */
function setupNavigationHandler() {
  let redirects: { [url: string]: number } = {};

  chrome.webNavigation.onHistoryStateUpdated.addListener(function (details) {
    const url = new URL(details.url);
    if (url.hostname !== 'github.com') {
      return;
    }
    redirects[url.href] = redirects[url.href] + 1;
    if ((redirects[url.href] + 1) % 2 == 0) {
      return;
    }
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTab = tabs[0];
      if (!activeTab) {
        return;
      }
      chrome.tabs.sendMessage(activeTab.id!, { event: 'grs-update' });
    });
  });
}

/* Check if the extension has been installed before. If not, open the
 * extension's page in a new tab. This is to show the user how to use
 * the extension. The page is only opened once. The extension is considered
 * installed if the 'grs-installed' key is set to true in the storage.
 * This key is set to true when the page is opened.
 */
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

/* Listen for updates to the tabs. If the URL is the authentication page,
 * extract the token from the URL and store it in the storage.
 */
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

/* Listen for messages from the popup. If the message is 'authenticate', open the
 * authentication page in a new tab using the URL from the message payload.
 */
chrome.runtime.onMessage.addListener((request) => {
  if (request.action === 'grs-authenticate') {
    chrome.tabs.create({
      url: request.data,
    });
  }
});

setupNavigationHandler();
