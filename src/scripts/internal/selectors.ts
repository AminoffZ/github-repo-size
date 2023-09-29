/**
 * Get the settings list item from the navigation bar.
 *
 * @returns The settings list item
 * @example
 * ```ts
 * getSettingsListItem();
// <li data-view-component="true" class="d-inline-flex">
//   <a id="settings-tab" href="/owner/repo/settings" ...>
//     <svg ...>
//       <path ...></path>
//     </svg>
//     <span ...>Settings</span>
//     <span ...></span>
//   </a>
// </li>
* ```
*/
export function getSettingsListItem() {
  return document.querySelector('.js-repo-nav')?.firstElementChild
    ?.lastElementChild;
}

/**
 * Get the filename anchor elements.
 *
 * @returns The filename anchor elements
 * @example
 * ```ts
 * getAnchors();
 * // {
 * //  "0": {},
 * //  "1": {},
 * //  "2": {},
 * //  ...
 * // }
 * ```
 */
export function getAnchors() {
  const anchors = document.querySelectorAll('a.Link--primary');
  return anchors as NodeListOf<HTMLAnchorElement>;
}

/**
 * Get the total size element.
 *
 * @returns The total size element
 * @example
 * ```ts
 * getTotalSizeButton();
 * // <a class="UnderlineNav-item grs-total-size..."...>
 * //   <span>...</span>
 * // </a>
 * ```
 */
export function getTotalSizeButton() {
  return document.querySelector('.grs-total-size') as HTMLElement | undefined;
}

/**
 * Get the size label element. This is the element that is shown at the top
 * of the size column in the GitHub file browser.
 *
 * @returns The size label element
 * @example
 * ```ts
 * getSizeLabel();
 * // <th class="grs grs-size"><span>Size</span></th>
 * ```
 */
export function getSizeLabel() {
  return document.querySelector('th.grs-size') as HTMLElement | undefined;
}

/**
 * Get the head of the table in GitHub's file browser.
 *
 * @returns The table head element
 * @example
 * ```ts
 * getThead();
 * // <thead>...</thead>
 * ```
 */
export function getThead() {
  return document.querySelector('thead');
}

/**
 * Get the span element that displays the total size of the files in the repository.
 *
 * @param totalSizeButton - The total size element
 * @returns The span element
 * @example
 * ```ts
 * getTotalSizeSpan(totalSizeButton);
 * // <span>...</span>
 * ```
 * @example
 * ```ts
 * getTotalSizeSpan(totalSizeButton);
 * // <span>806.07 KB</span>
 * ```
 */
export function getTotalSizeSpan(totalSizeButton: HTMLElement) {
  return totalSizeButton.querySelector('span');
}
