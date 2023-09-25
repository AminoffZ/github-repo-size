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

async function main() {
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
  anchors.forEach((anchor) => {
    const path = anchor.getAttribute('href');
    if (!path) {
      return;
    }
    const pathArray = path.split('/');
    const pathName = pathArray[pathArray.length - 1];
    const treeItem = repoInfo.tree.find((item) => item.path === pathName);
    if (!treeItem) {
      return;
    }
    let size = treeItem.size;
    if (!size) {
      size = getNestedSize(treeItem, repoInfo.tree);
    }
    const sizeString = formatBytes(size);
    const span = document.createElement('span');
    span.innerText = sizeString;
    const row = anchor.parentElement?.parentElement?.parentElement;
    const div = row?.childNodes[row.childNodes.length - 2].cloneNode(false);
    div?.appendChild(span);
    if (!div) {
      return;
    }

    row?.insertBefore(div, row.childNodes[row.childNodes.length - 2]);
  });
}

main();
