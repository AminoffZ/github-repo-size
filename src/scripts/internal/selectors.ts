/**
 * Gets the nav button list.
 *
 * @returns element containing the nav buttons
 */
export function getNavButtons() {
  return document.querySelector('.js-repo-nav > ul') as HTMLUListElement | null;
}

/**
 * Get the filename anchor elements.
 *
 * @param table - The table element
 * @returns The filename anchor elements
 * @example
 * ```ts
 * getFileAnchors(table);
 * // {
 * //  "0": {},
 * //  "1": {},
 * //  "2": {},
 * //  ...
 * // }
 * ```
 */
export function getFileAnchors(table: HTMLTableElement) {
  return table.querySelectorAll(
    'a.Link--primary'
  ) as NodeListOf<HTMLAnchorElement> | null;
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

/**
 * Gets the top td in GitHubs file browser.
 *
 * @returns The top element
 * @example
 * ```ts
 * getFirstTd();
 * // <td colspan="3" ...>
 * //   <h3 ...></h3>
 * //   <a href="/owner/repo/tree/branch" ...>
 * //     <div ...>
 * //       <svg ...>
 * //         <path ...></path>
 * //       </svg>
 * //       ..
 * //     </div>
 * //   </a>
 * // </td>
 * ```
 */
export function getFirstTd() {
  return getTable()?.querySelector('td') as HTMLTableRowElement | null;
}

/**
 * Gets the table in GitHubs file browser.
 *
 * @returns The table element
 * @example
 * ```ts
 * getTable();
 * // <table ...>
 * //   <thead>...</thead>
 * //   <tbody>...</tbody>
 * // </table>
 * ```
 */
export function getTable() {
  return document.querySelector(
    'table[aria-labelledby="folders-and-files"]'
  ) as HTMLTableElement | null;
}
