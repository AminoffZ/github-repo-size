// /* global chrome, alert, prompt, confirm */

// const GITHUB_TOKEN_KEY = 'x-github-token';
// const TOKEN_FEATURE_INFORMATION_KEY = 'user-knows-token-feature';

// const storage = chrome.storage.sync || chrome.storage.local;

// function setGithubToken(key: string, cb: () => void): void {
//   const obj: { [key: string]: string } = {};
//   obj[GITHUB_TOKEN_KEY] = key;

//   storage.set(obj, function () {
//     alert(
//       'Your Github token has been set successfully. Reload the Github page to see changes.'
//     );

//     cb();
//   });
// }

// function handleOldGithubToken(
//   cb: (error: any, askToSetToken?: boolean) => void
// ): void {
//   storage.get(GITHUB_TOKEN_KEY, function (storedData) {
//     const oldGithubToken = storedData[GITHUB_TOKEN_KEY];

//     if (oldGithubToken) {
//       if (
//         confirm(
//           'You have already set your Github token. Do you want to remove it?'
//         )
//       ) {
//         storage.remove(GITHUB_TOKEN_KEY, function () {
//           alert(
//             'You have successfully removed Github token. Click extension icon again to set a new token.'
//           );

//           cb(null, false);
//         });
//       } else {
//         cb(null, false);
//       }
//     } else {
//       cb(null, true);
//     }
//   });
// }

// const userNowKnowsAboutGithubTokenFeature = (cb: () => void): void => {
//   const obj: { [key: string]: boolean } = {};
//   obj[TOKEN_FEATURE_INFORMATION_KEY] = true;

//   storage.set(obj, cb);
// };

// function informUserAboutGithubTokenFeature(): void {
//   storage.get(TOKEN_FEATURE_INFORMATION_KEY, function (storedData) {
//     const userKnows = storedData[TOKEN_FEATURE_INFORMATION_KEY];

//     if (!userKnows) {
//       if (
//         confirm(
//           'GitHub Repository Size now supports private repositories through Github personal access tokens. Do you want to add a token?'
//         )
//       ) {
//         askGithubToken(() => {
//           userNowKnowsAboutGithubTokenFeature(() => {});
//         });
//       } else {
//         userNowKnowsAboutGithubTokenFeature(() => {
//           alert('You can click extension icon to set a token.');
//         });
//       }
//     }
//   });
// }

// const askGithubToken = (cb: () => void): void => {
//   const githubToken: string | null = prompt('Please enter your Github token');

//   if (githubToken === null) return;

//   if (githubToken) {
//     setGithubToken(githubToken, cb);
//   } else {
//     alert('You have entered an empty token.');
//     cb();
//   }
// };

// chrome.action.onClicked.addListener((tab: chrome.tabs.Tab) => {
//   handleOldGithubToken((_, askToSetToken) => {
//     if (askToSetToken) {
//       askGithubToken(() => {});
//     }
//   });
// });

// informUserAboutGithubTokenFeature();
