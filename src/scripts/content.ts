import activeBrowser from '../shared/browserWrapper';
import { updateDOM } from './internal';

/**
 * Handle the update message from the background script.
 *
 * @param sendResponse - Responding with whether the update was successful
 */
const handleUpdate = async (sendResponse: (response: any) => void) => {
  const updateSuccessful = await updateDOM();
  sendResponse({ success: updateSuccessful });
};

/**
 * Listen for messages from the background script. If the message is
 * 'grs-update', update the DOM.
 *
 * @param request - The message from the background script
 * @param sender - The sender of the message
 * @param sendResponse - The function to call when we are done
 */
activeBrowser.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.event === 'grs-update') {
      handleUpdate(sendResponse);
    }
    return true;
  }
);
