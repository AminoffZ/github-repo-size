import { updateDOM } from './internal';

/**
 * Update the DOM.
 * If our elements have not been added, wait 500 ms and try again.
 * If we have tried 5 times, give up.
 * @param attempts - The number of times we have tried to update the DOM
 */
async function main(attempts: number) {
  await updateDOM();
  const grsElements = document.getElementsByClassName('grs');
  if (grsElements.length < 2) {
    if (attempts >= 4) {
      console.warn('GRS: Could not find any elements to update, stopping.');
      return;
    }
    setTimeout(async () => await main((attempts += 1)), 500);
  }
}

/**
 * Listen for messages from the background script. If the message is
 * 'grs-update', update the DOM. We add a delay to increase that the
 * likelyhood that the DOM has been changed before we try to update it.
 * Resets the attempts counter.
 *
 * @param request - The message from the background script
 * @param sender - The sender of the message
 * @param sendResponse - The function to call when we are done
 */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.event === 'grs-update') {
    setTimeout(async () => await main(0), 750);
  }
});
