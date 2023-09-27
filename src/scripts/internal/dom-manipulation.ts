import {
  createSizeLabel,
  createTotalSizeButton,
  formatBytes,
  getAnchors,
  getNavButtons,
  getPathObject,
  getRepoInfo,
  getSize,
  getSizeLabel,
  getThead,
  getTotalSizeButton,
  getTotalSizeSpan,
  hashClass,
} from '.';
import type { GRSUpdate, GitHubTree } from './types';

function insertSizeLabel(
  headRow: ChildNode | null | undefined,
  th: HTMLTableCellElement
) {
  if (headRow) {
    headRow?.insertBefore(
      th,
      headRow.childNodes[headRow.childNodes.length - 1]
    );
  }
}

function insertSizeColumn() {
  if (getSizeLabel()) {
    return;
  }

  const thead = getThead();
  const th = createSizeLabel();
  const headRow = thead?.firstChild;
  insertSizeLabel(headRow, th);
}

function insertToFileExplorer(
  anchor: HTMLAnchorElement,
  span: HTMLSpanElement
) {
  const row = anchor.closest('tr');
  if (!row) {
    return;
  }

  const td = row.childNodes[row.childNodes.length - 2].cloneNode(false);
  if (!(td instanceof HTMLElement)) {
    return;
  }

  td.classList.add('grs');
  td.appendChild(span);
  row.insertBefore(td, row.childNodes[row.childNodes.length - 1]);
}

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

function setTotalSize(repoInfo: GitHubTree) {
  let navButtons = getNavButtons();
  if (!navButtons) {
    return;
  }

  let totalSizeButton = getTotalSizeButton();
  if (!totalSizeButton) {
    totalSizeButton = createTotalSizeButton(navButtons);
    if (!totalSizeButton) {
      return;
    }
  }

  navButtons.appendChild(totalSizeButton);
  if (!totalSizeButton) {
    return;
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
}

export async function updateDOM() {
  const anchors = getAnchors();
  if (!anchors || anchors.length === 0) {
    return;
  }

  const pathObject = getPathObject();
  if (!pathObject || !pathObject.owner || !pathObject.repo) {
    return;
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
  if (!repoInfo) {
    return;
  }

  const updates: GRSUpdate = [];

  anchors.forEach((anchor, index) => {
    const anchorPath = anchor.getAttribute('href');
    if (!anchorPath) {
      return;
    }

    const anchorPathObject = getPathObject(anchorPath);
    if (!repoInfo.tree.some((file) => file.path === anchorPathObject.path)) {
      return;
    }

    const size = getSize(anchorPathObject, repoInfo.tree);
    const sizeString = formatBytes(size);
    const span = document.createElement('span');
    const spanClass = hashClass(anchorPath);
    span.className = spanClass;

    if (document.querySelector(`span.${spanClass}`)) {
      return;
    }

    span.innerText = sizeString;

    updates.push({ anchor, span, index });
  });

  if (pathObject.path) {
    insertSizeColumn();
  }

  setTotalSize(repoInfo);
  updates.forEach(({ anchor, span, index }) => {
    if (pathObject.path) {
      // for some reason the rows have two td's with name of each file
      if (index % 2 === 1) {
        insertToFileExplorer(anchor, span);
      }
      return;
    }
    insertToHome(anchor, span);
  });
}
