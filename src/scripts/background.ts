chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log(tab.url);
  if (
    tab.url &&
    tab.url.startsWith('https://aminoffz.github.io/#access_token=')
  ) {
    console.log('url match!');
    // Extract the token or any other data from the URL.
    // For example:
    const url: URL = new URL(tab.url);
    console.log(url.hash);
    const providerTokenParam: string | undefined = url.hash
      .split('&')
      .find((param) => param.startsWith('provider_token='));
    console.log(providerTokenParam);
    const providerToken: string | undefined = providerTokenParam?.split('=')[1];

    if (providerToken) {
      (chrome.storage.sync || chrome.storage.local).set(
        {
          'repo-size-oauth-token': providerToken,
        },
        () => {
          console.log('Token stored successfully');
        }
      );
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
