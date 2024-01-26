let activeBrowser!: typeof chrome | typeof browser;
if (typeof chrome !== 'undefined' && typeof chrome.runtime !== 'undefined') {
  activeBrowser = chrome;
} else if (
  typeof browser !== 'undefined' &&
  typeof browser.runtime !== 'undefined'
) {
  activeBrowser = browser;
}
export default activeBrowser;
