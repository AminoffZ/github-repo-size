import activeBrowser from './browserWrapper';
let storage;

if (typeof activeBrowser !== 'undefined') {
  storage = activeBrowser.storage.sync || activeBrowser.storage.local;
}

export default storage as
  | chrome.storage.SyncStorageArea
  | browser.storage.StorageAreaSync;
