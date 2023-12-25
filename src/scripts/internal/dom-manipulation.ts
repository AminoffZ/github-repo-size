import {
  createSizeLabel,
  createSizeSpan,
  createTotalSizeElement,
  formatBytes,
  getFileAnchors,
  getFirstTd,
  getNavButtons,
  getPathObject,
  getRepoInfo,
  getSize,
  getSizeLabel,
  getTable,
  getThead,
  getTotalSizeButton,
  getTotalSizeSpan,
} from '.';
import type { GRSUpdate, GitHubTree } from './types';

/**
 * Insert the size label element into the table head.
 * This is the element that is shown at the top of the size column in the GitHub file browser.
 *
 * @param headRow - The head row element
 * @param th - The size label element
 */
function insertSizeLabel(headRow: ChildNode, th: HTMLTableCellElement) {
  if (headRow) {
    headRow.insertBefore(th, headRow.childNodes[headRow.childNodes.length - 1]);
  }
}

/**
 * Expand the navigate up element to span the entire table.
 * This is the element that is shown at the top of the GitHub file browser
 * and is used to navigate up in the file tree.
 */
function expandFirstTd() {
  const firstTd = getFirstTd();
  if (!firstTd) {
    console.warn('Could not find first td.');
    return;
  }
  firstTd.setAttribute('colspan', '4');
}

/**
 * Insert the size column into the table on the GitHub file browser.
 * This is the column that displays the size of each file.
 */
function insertSizeColumn() {
  if (getSizeLabel()) {
    console.warn('Size label already exists.');
    return;
  }

  const thead = getThead();
  const headRow = thead?.firstChild;
  if (!headRow) {
    return;
  }

  expandFirstTd();

  const th = createSizeLabel();
  insertSizeLabel(headRow, th);
}

/**
 * Insert when in the GitHub file browser.
 *
 * @param anchor - The anchor element as reference
 * @param span - The span element to insert
 */
function insertToFileExplorer(
  anchor: HTMLAnchorElement,
  span: HTMLSpanElement
) {
  const row = anchor.closest('tr');
  if (!row) {
    console.warn('Could not find matching row.');
    return false;
  }

  const td = row.childNodes[row.childNodes.length - 2].cloneNode(false);
  if (!(td instanceof HTMLElement)) {
    console.warn('Could not clone td to append size.');
    return false;
  }

  td.classList.add('grs', 'grs-item');
  td.style.setProperty('text-wrap', 'nowrap');
  td.style.setProperty('text-align', 'right');
  td.appendChild(span);
  row.insertBefore(td, row.childNodes[row.childNodes.length - 1]);
  return true;
}

/**
 * Insert when on the GitHub home page.
 *
 * @param anchor - The anchor element as reference
 * @param span - The span element to insert
 */
function insertToHome(anchor: HTMLAnchorElement, span: HTMLSpanElement) {
  const row = anchor.closest('[role="row"]');
  if (!row) {
    return;
  }

  const div = row?.childNodes[row.childNodes.length - 2].cloneNode(false);
  if (!div) {
    return;
  }

  span.style.marginRight = '0.5rem';
  div.appendChild(span);
  row.insertBefore(div, row.childNodes[row.childNodes.length - 2]);
}

/**
 * Set the total size of the files in the repository.
 * This concerns the element shown in the navigation bar next to Settings.
 *
 * @param repoInfo - The repo info
 */
function setTotalSize(repoInfo: GitHubTree) {
  let navButtons = getNavButtons();
  if (!navButtons) {
    return;
  }

  let totalSizeButton = getTotalSizeButton();

  // Check if total size button already exists
  if (!totalSizeButton) {
    totalSizeButton = createTotalSizeElement();

    // If creating the button fails, exit the function
    if (!totalSizeButton) {
      return;
    }
  }

  const existingCounterSpan = totalSizeButton.querySelector('span.Counter');
  if (existingCounterSpan) {
    existingCounterSpan.remove();
  }

  const span = getTotalSizeSpan(totalSizeButton);
  if (!span) {
    return;
  }

  let totalSize = 0;
  repoInfo.tree.forEach((item) => {
    totalSize += item.size ?? 0;
  });

  span.innerText = formatBytes(totalSize);

  navButtons.appendChild(totalSizeButton);
}

/**
 * Update the DOM.
 * This is the main function that is called when the DOM should be updated.
 */
export async function updateDOM() {
  const table = getTable();
  if (!table) {
    console.warn('Could not find file table.');
    return false;
  }

  const anchors = getFileAnchors(table);
  if (!anchors || anchors.length === 0) {
    console.warn('Could not find any file anchors.');
    return false;
  }

  const pathObject = getPathObject();
  if (!pathObject || !pathObject.owner || !pathObject.repo) {
    console.warn('Could not get path object.');
    return false;
  }

  let type = pathObject.type;
  let branch = pathObject.branch;
  if (type !== 'tree' && type !== 'blob') {
    branch = 'main';
  }

  const repoInfo = await getRepoInfo(
    pathObject.owner + '/' + pathObject.repo,
    branch
  );
  if (!repoInfo || !repoInfo.tree) {
    const warnMessage = `
    Could not get repo info, aborting...\n
    Click the extension button to see remaining requests.\n
    If you see 0 remaining requests, you have exceeded the rate limit.\n
    Use OAuth or a personal access token to increase the rate limit.
    `;
    console.warn(warnMessage);
    return true;
  }

  const updates: GRSUpdate = [];

  for (let index = 0; index < anchors.length; index++) {
    const anchor = anchors[index];
    const anchorPath = anchor.getAttribute('href');
    if (!anchorPath) {
      console.warn('Could not get anchor path.');
      return false;
    }

    const anchorPathObject = getPathObject(anchorPath);
    if (!repoInfo.tree.some((file) => file.path === anchorPathObject.path)) {
      console.warn('Could not find file in repo info.');
      return false;
    }

    const size = getSize(anchorPathObject, repoInfo.tree);
    const span = createSizeSpan(anchorPath, size);

    // If creating the span fails, assume that the DOM has already been updated.
    if (!span) {
      console.warn('Could not create size span.');
      return true;
    }

    updates.push({ anchor, span, index });
  }

  setTotalSize(repoInfo);

  updates.forEach(({ anchor, span, index }) => {
    // for some reason the rows have two td's with name of each file
    if (index % 2 === 1) {
      return insertToFileExplorer(anchor, span);
    }
  });

  // If there are no items, we have not updated the DOM.
  if (document.querySelectorAll('.grs-item').length === 0) {
    return false;
  }

  insertSizeColumn();

  return true;
}
