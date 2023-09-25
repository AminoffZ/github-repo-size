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

async function createRequest(repo: string) {
  const headers = new Headers();
  headers.append('User-Agent', 'AminoffZ/github-repo-size');
  const token = await getToken();
  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }
  const request = new Request(
    `https://api.github.com/repos/${repo}/git/trees/main?recursive=1`,
    {
      headers,
    }
  );
  return request;
}

async function getRepoInfo(repo: string) {
  const request = await createRequest(repo);
  const response = await fetch(request)
    .then(async (res) => {
      const data = await res.json();
      console.log(data);
      return data as GitHubTree;
    })
    .catch((err) => {
      console.log(err);
      return undefined;
    });
  return response;
}

function getAnchors() {
  const anchors = document.querySelectorAll('a.Link--primary');
  return anchors as NodeListOf<HTMLAnchorElement>;
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

function extendUpNavigator() {
  const up = document.querySelector('tbody')?.firstChild?.firstChild;
  if (!(up instanceof HTMLElement)) {
    return;
  }
  up.setAttribute('colspan', '4');
}

function addSizeColumn() {
  const thead = document.querySelector('thead');
  const th = document.createElement('th');
  th.className = 'grs grs-size';
  if (document.querySelector('th.grs-size')) {
    return;
  }
  th.innerText = 'Size';
  th.style.textAlign = 'right';
  const headRow = thead?.firstChild;
  if (!headRow) {
    return;
  }
  headRow?.insertBefore(th, headRow.childNodes[headRow.childNodes.length - 1]);
}

function appendToTableRow(anchor: HTMLAnchorElement, span: HTMLSpanElement) {
  console.log('appendToTableRow');
  const row =
    anchor.parentElement?.parentElement?.parentElement?.parentElement
      ?.parentElement?.parentElement;
  if (!row) {
    console.log('row is null');
    return;
  }
  console.log(row);
  const td = row.childNodes[row.childNodes.length - 2].cloneNode(false);
  if (!(td instanceof HTMLElement)) {
    console.log('td is not HTMLElement');
    return;
  }
  console.log(span.textContent);
  td.style.textAlign = 'right';
  td.classList.add('grs');
  td.appendChild(span);
  console.log('inserting td');
  row.insertBefore(td, row.childNodes[row.childNodes.length - 1]);
  console.log(row);
}

function appendToHome(anchor: HTMLAnchorElement, span: HTMLSpanElement) {
  const row = anchor.parentElement?.parentElement?.parentElement;
  console.log(row);
  const div = row?.childNodes[row.childNodes.length - 2].cloneNode(false);
  div?.appendChild(span);
  if (!div) {
    return;
  }

  row?.insertBefore(div, row.childNodes[row.childNodes.length - 2]);
}

async function updateDOM() {
  const anchors = getAnchors();
  if (!anchors || anchors.length === 0) {
    return;
  }
  console.log(anchors);
  const pathObject = getPathObject();
  if (!pathObject) {
    return;
  }
  console.log(pathObject);
  const repoInfo = await getRepoInfo(pathObject.owner + '/' + pathObject.repo);
  if (!repoInfo) {
    return;
  }
  console.log(repoInfo);

  const updates: Array<{
    anchor: HTMLAnchorElement;
    span: HTMLSpanElement;
    index: number;
  }> = [];

  anchors.forEach((anchor, index) => {
    const path = anchor.getAttribute('href');
    if (!path) {
      return;
    }
    const pathArray = path.split('/');
    const fileName = pathArray[pathArray.length - 1];
    const root = pathObject.path ? pathObject.path + '/' : '';
    const treeItem = repoInfo.tree.find((item) => {
      const path = item.path;
      return path === root + fileName;
    });
    if (!treeItem) {
      return;
    }
    let size = treeItem.size;
    if (!size) {
      size = getNestedSize(treeItem, repoInfo.tree);
    }
    const sizeString = formatBytes(size);
    const span = document.createElement('span');
    const spanClass = `grs-${path.replaceAll('/', '-')}`;
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
    extendUpNavigator();
  }

  updates.forEach(({ anchor, span, index }) => {
    if (pathObject.path) {
      if (index % 2 === 1) {
        appendToTableRow(anchor, span);
      }
      return;
    }
    appendToHome(anchor, span);
  });
}

async function start() {
  console.log('start');
  let lastUrl = window.location.href;
  await updateDOM();
  const popsate = setInterval(async () => {
    if (lastUrl !== window.location.href) {
      lastUrl = window.location.href;
      clearInterval(popsate);
      await startInterval();
    }
  }, 1000);
}

const checkGitHubContent = async (timer: Timer) => {
  // Check if some expected GitHub content is present.
  // Here, we're just using the presence of anchor elements as an example.
  const anchors = document.querySelectorAll('a.Link--primary');
  if (anchors.length > 0) {
    clearInterval(timer); // Stop the periodic checks
    await start();
  }
};

async function startInterval() {
  console.log('startInterval');
  const timer = setInterval(async () => await checkGitHubContent(timer), 1000);
}

async function main() {
  console.log('main');
  await startInterval();
}

main();
