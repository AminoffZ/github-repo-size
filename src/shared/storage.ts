let storage;

if (typeof chrome !== 'undefined') {
  storage = chrome.storage.sync || chrome.storage.local;
}

export default storage! as chrome.storage.SyncStorageArea;
