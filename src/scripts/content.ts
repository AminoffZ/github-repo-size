import { getAnchors, updateDOM } from './internal';

/**
 * Update the DOM and start the SPA redirect handling.
 */
async function start() {
  await updateDOM();
  // SPA redirect handling
  let lastUrl = window.location.href;
  const popsate = setInterval(async () => {
    if (lastUrl !== window.location.href) {
      lastUrl = window.location.href;
      clearInterval(popsate);
      await startInterval();
    }
  }, 1000);
}

/**
 * Check if the GitHub content is loaded.
 * If it is, start updating the DOM.
 *
 * @param timer - The interval timer
 */
const checkGitHubContent = async (timer: Timer) => {
  // Get the anchors for files
  const anchors = getAnchors();
  if (anchors?.length > 0) {
    clearInterval(timer); // Stop the periodic checks
    await start();
  }
};

/**
 * Start the interval that checks for GitHub content.
 */
async function startInterval() {
  const timer = setInterval(async () => await checkGitHubContent(timer), 1000);
}

/**
 * The main function. This is the entry point of the extension.
 */
async function main() {
  await startInterval();
}

main();
