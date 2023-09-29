import { updateDOM } from './internal';

/**
 * Update the DOM.
 * If our elements have not been added, wait 500 ms and try again.
 */
function main() {
  updateDOM();
  const grsElements = document.getElementsByClassName('grs');
  if (grsElements.length < 2) {
    setTimeout(main, 500);
  }
}

/**
 * Listen for messages from the background script. If the message is
 * 'grs-update', update the DOM. We add a delay to increase that the
 * likelyhood that the DOM has been changed before we try to update it.
 */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.event === 'grs-update') {
    setTimeout(main, 750);
  }
});
