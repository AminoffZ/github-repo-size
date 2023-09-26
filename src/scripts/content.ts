import { GITHUB_TOKEN_KEY, OAUTH_TOKEN_KEY, storage } from '../constants';

type PathObject = {
  owner: string | undefined;
  repo: string | undefined;
  type?: string | undefined;
  branch?: string | undefined;
  path?: string | undefined;
};

type GitHubTreeItem = {
  path: string;
  mode: string;
  type: string;
  sha: string;
  size?: number;
  url: string;
};

type GitHubTree = {
  sha: string;
  url: string;
  tree: GitHubTreeItem[];
  truncated: boolean;
};

function getPathObject() {
  const pathObject = {};
  try {
    const paths = window.location.pathname.split('/');
    Object.assign(pathObject, {
      owner: paths.at(1),
      repo: paths.at(2),
      type: paths.at(3),
      branch: paths.at(4),
      path: paths.slice(5)?.join('/'),
    });
  } catch (e) {
    console.error(e);
  }
  return pathObject as PathObject;
}

async function getToken() {
  const oauthToken: string | undefined = (await storage.get(OAUTH_TOKEN_KEY))[
    OAUTH_TOKEN_KEY
  ];
  const githubToken: string | undefined = (await storage.get(GITHUB_TOKEN_KEY))[
    GITHUB_TOKEN_KEY
  ];
  const token = githubToken || oauthToken;
  return token;
}

async function createTreeRequest(repo: string, branch: string) {
  const headers = new Headers();
  headers.append('User-Agent', 'AminoffZ/github-repo-size');
  const token = await getToken();
  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }
  const request = new Request(
    `https://api.github.com/repos/${repo}/git/trees/${branch}?recursive=1`,
    {
      headers,
    }
  );
  return request;
}

async function getRepoInfo(repo: string, branch: string = 'main') {
  const request = await createTreeRequest(repo, branch);
  const response = await fetch(request)
    .then(async (res) => {
      const data = await res.json();
      return data as GitHubTree;
    })
    .catch((err) => {
      console.error(err);
      return undefined;
    });
  return response;
}

function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function getNestedSize(
  treeItem: GitHubTreeItem,
  tree: GitHubTreeItem[]
): number {
  if (treeItem.type === 'blob') {
    return treeItem.size ?? 0;
  } else if (treeItem.type === 'tree') {
    const nestedTree = tree.filter((item) => {
      return item.path.startsWith(treeItem.path + '/');
    });
    const size = nestedTree.reduce((acc, cur) => {
      return acc + getNestedSize(cur, tree);
    }, 0);
    treeItem.size = size;
    return size;
  } else {
    return 0;
  }
}

function addSizeColumn() {
  if (document.querySelector('th.grs-size')) {
    return;
  }
  const thead = document.querySelector('thead');
  const th = document.createElement('th');
  const span = document.createElement('span');
  span.innerText = 'Size';
  span.style.color = 'var(--fgColor-muted, var(--color-fg-muted))';
  th.className = 'grs grs-size';
  th.appendChild(span);
  const headRow = thead?.firstChild;
  if (!headRow) {
    return;
  }
  headRow?.insertBefore(th, headRow.childNodes[headRow.childNodes.length - 1]);
}

function appendToTableRow(anchor: HTMLAnchorElement, span: HTMLSpanElement) {
  const row =
    anchor.parentElement?.parentElement?.parentElement?.parentElement
      ?.parentElement?.parentElement;
  if (!row) {
    return;
  }
  const td = row.childNodes[row.childNodes.length - 2].cloneNode(false);
  if (!(td instanceof HTMLElement)) {
    return;
  }
  td.style.textAlign = 'right';
  td.classList.add('grs');
  td.appendChild(span);
  row.insertBefore(td, row.childNodes[row.childNodes.length - 1]);
}

function appendToHome(anchor: HTMLAnchorElement, span: HTMLSpanElement) {
  const row = anchor.parentElement?.parentElement?.parentElement;
  const div = row?.childNodes[row.childNodes.length - 2].cloneNode(false);
  div?.appendChild(span);
  if (!div) {
    return;
  }

  row?.insertBefore(div, row.childNodes[row.childNodes.length - 2]);
}

// 🤓 will 😂
function djb2(string: string) {
  let hash = '🔏'.codePointAt(0)! & 0x1505; // 5381.
  for (let i = 0; i < string.length; i++) {
    hash = ((hash << 5) + hash + string.charCodeAt(i)) & 0x7fffffff; // multiply by 33 and force positive.
  }
  return hash;
}

function getNavButtons() {
  return document.querySelector('.js-repo-nav')?.firstElementChild
    ?.lastElementChild;
}

function getAnchors() {
  const anchors = document.querySelectorAll('a.Link--primary');
  return anchors as NodeListOf<HTMLAnchorElement>;
}

function getTotalSizeButton() {
  return document.querySelector('.grs-total-size') as HTMLElement | undefined;
}

function createTotalSizeButton(navButtons: ChildNode) {
  const totalSizeButton = navButtons?.lastChild?.cloneNode(true);
  if (!(totalSizeButton instanceof HTMLElement)) {
    return;
  }
  totalSizeButton.classList.add('grs-total-size');
  const navTotalSizeAnchor = totalSizeButton.closest('a');
  if (!(navTotalSizeAnchor instanceof HTMLElement)) {
    return;
  }
  if (navTotalSizeAnchor.getAttribute('href')) {
    navTotalSizeAnchor.attributes.removeNamedItem('href');
  }
  const svg = navTotalSizeAnchor.firstElementChild;
  if (!svg) {
    return;
  }
  navTotalSizeAnchor.removeChild(svg);
  const span = navTotalSizeAnchor.querySelector('span') as
    | HTMLSpanElement
    | undefined;
  if (!(span instanceof HTMLSpanElement)) {
    return;
  }
  span.insertAdjacentHTML(
    'beforebegin',
    `
    <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="UnderlineNav-octicon">
      <title>database</title>
      <path d="M8,2C5.05,2 2.67,3.19 2.67,4.67C2.67,6.15 5.05,7.33 8,7.33C10.95,7.33 13.33,6.15 13.33,4.67C13.33,3.19 10.95,2 8,2M2.67,6V8C2.67,9.48 5.05,10.67 8,10.67C10.95,10.67 13.33,9.48 13.33,8V6C13.33,7.48 10.95,8.67 8,8.67C5.05,8.67 2.67,7.48 2.67,6M2.67,9.33V11.33C2.67,12.81 5.05,14 8,14C10.95,14 13.33,12.81 13.33,11.33V9.33C13.33,10.81 10.95,12 8,12C5.05,12 2.67,10.81 2.67,9.33Z" />
    </svg>
    `
  );
  span.innerText = '...';
  return totalSizeButton;
}

async function setTotalSize(repoInfo: GitHubTree) {
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
  const span = totalSizeButton.querySelector('span');
  if (!span) {
    return;
  }
  let totalSize = 0;
  repoInfo.tree.forEach((item) => {
    totalSize +=
      item.type === 'blob'
        ? item.size ?? 0
        : getNestedSize(item, repoInfo.tree);
  });
  span.innerText = formatBytes(totalSize);
}

async function updateDOM() {
  const anchors = getAnchors();
  if (!anchors || anchors.length === 0) {
    return;
  }
  const pathObject = getPathObject();
  if (!pathObject) {
    return;
  }
  const repoInfo = await getRepoInfo(
    pathObject.owner + '/' + pathObject.repo,
    pathObject.branch
  );
  if (!repoInfo) {
    return;
  }
  await setTotalSize(repoInfo);

  const updates: Array<{
    anchor: HTMLAnchorElement;
    span: HTMLSpanElement;
    index: number;
  }> = [];

  anchors.forEach((anchor, index) => {
    const anchorPath = anchor.getAttribute('href');
    if (!anchorPath) {
      return;
    }
    const anchorPaths = anchorPath.split('/');
    const fileName = anchorPaths[anchorPaths.length - 1];
    const base = pathObject.path ? pathObject.path + '/' : '';
    const file = repoInfo.tree.find((item) => {
      const path = item.path;
      return path === base + fileName;
    });
    if (!file) {
      return;
    }
    // if file doesn't have a size, it's a directory
    let size = file.size;
    if (!size) {
      size = getNestedSize(file, repoInfo.tree);
    }
    const sizeString = formatBytes(size);
    const span = document.createElement('span');
    const spanClass = `grs-${djb2(anchorPath.replaceAll('/', '-'))}`;
    span.className = spanClass;
    if (document.querySelector(`span.${spanClass}`)) {
      return;
    }
    span.style.color = 'var(--fgColor-muted, var(--color-fg-muted))';
    span.innerText = sizeString;
    updates.push({ anchor, span, index });
  });

  if (pathObject.path) {
    addSizeColumn();
  }

  updates.forEach(({ anchor, span, index }) => {
    if (pathObject.path) {
      // for some reason the rows have two td's with name of each file
      if (index % 2 === 1) {
        appendToTableRow(anchor, span);
      }
      return;
    }
    appendToHome(anchor, span);
  });
}

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
  const anchors = document.querySelectorAll('a.Link--primary');
  if (anchors.length > 0) {
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
