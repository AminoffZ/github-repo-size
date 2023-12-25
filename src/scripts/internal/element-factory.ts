import { formatBytes, hashClass } from '.';

/**
 * Create a table header element for the size column.
 *
 * @returns The table header element
 * @example
 * ```ts
 * createSizeLabel();
 * // <th class="grs grs-size"><span>Size</span></th>
 * ```
 */
export function createSizeLabel() {
  const th = document.createElement('th');
  const span = document.createElement('span');
  span.innerText = 'Size';
  th.className = 'grs grs-size';
  th.style.setProperty('text-align', 'right');
  th.style.setProperty('text-wrap', 'nowrap');
  th.style.setProperty('overflow', 'hidden');
  th.appendChild(span);
  return th;
}

/**
 * Create a total size element. The element is shown at the end of the navigation bar.
 * It displays the total size of the repository.
 *
 * @returns The total size element
 * @example
 * ```ts
 * createTotalSizeElement();
 * // <li style="align-items: center" class="grs-total-size d-inline-flex">
 * //   <svg>database-icon</svg>
 * //   <span>...</span>
 * // </li>
 * ```
 */
export function createTotalSizeElement() {
  const totalSizeButton = document.createElement('li');
  // unique identifier and GitHub's li style class
  totalSizeButton.classList.add('grs-total-size', 'd-inline-flex');
  // align the svg icon with the text
  totalSizeButton.style.setProperty('align-items', 'center');
  // create the span element that will contain the total size and append it to the button
  const span = createTotalSizeSpan();
  totalSizeButton.appendChild(span);
  // add the 'database' icon
  span.insertAdjacentHTML(
    'beforebegin',
    `
    <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="UnderlineNav-octicon">
      <title>database</title>
      <path d="M8,2C5.05,2 2.67,3.19 2.67,4.67C2.67,6.15 5.05,7.33 8,7.33C10.95,7.33 13.33,6.15 13.33,4.67C13.33,3.19 10.95,2 8,2M2.67,6V8C2.67,9.48 5.05,10.67 8,10.67C10.95,10.67 13.33,9.48 13.33,8V6C13.33,7.48 10.95,8.67 8,8.67C5.05,8.67 2.67,7.48 2.67,6M2.67,9.33V11.33C2.67,12.81 5.05,14 8,14C10.95,14 13.33,12.81 13.33,11.33V9.33C13.33,10.81 10.95,12 8,12C5.05,12 2.67,10.81 2.67,9.33Z" />
    </svg>
    `
  );
  return totalSizeButton;
}

function createTotalSizeSpan() {
  const span = document.createElement('span');
  // add loading dots to be replaced by the total size
  span.innerText = '...';
  return span;
}

/**
 * Create a span element to display the size of a file or directory.
 *
 * @param anchorPath - The path of the anchor element used as reference
 * @param size - The size of the file or directory
 * @returns The size span element
 * @example
 * ```ts
 * createSizeSpan(anchorPath, size);
 * // <span class="grs grs-...">...</span>
 * ```
 */
export function createSizeSpan(anchorPath: string, size: number) {
  const sizeString = formatBytes(size);
  const span = document.createElement('span');
  const spanClass = hashClass(anchorPath);
  span.classList.add('grs', spanClass);

  if (document.querySelector(`span.${spanClass}`)) {
    console.warn(`Duplicate span class: ${spanClass}`);
    return;
  }

  span.innerText = sizeString;
  return span;
}
