import activeBrowser from './browserWrapper';
let storage: chrome.storage.SyncStorageArea | browser.storage.StorageAreaSync;

if (typeof activeBrowser !== 'undefined') {
  storage = activeBrowser.storage.sync || activeBrowser.storage.local;
}

export default (storage! as chrome.storage.SyncStorageArea) ||
  (storage! as browser.storage.StorageAreaSync);
