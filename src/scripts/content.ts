import { getAnchors, updateDOM } from './internal';

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

const checkGitHubContent = async (timer: Timer) => {
  // Get the anchors for files
  const anchors = getAnchors();
  if (anchors?.length > 0) {
    clearInterval(timer); // Stop the periodic checks
    await start();
  }
};

async function startInterval() {
  const timer = setInterval(async () => await checkGitHubContent(timer), 1000);
}

async function main() {
  await startInterval();
}

main();
