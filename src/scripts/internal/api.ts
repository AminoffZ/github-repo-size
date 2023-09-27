import { getToken } from '../../shared';
import type { GitHubTree } from './types';

function API(repo: string, branch: string) {
  return `https://api.github.com/repos/${repo}/git/trees/${branch}?recursive=1`;
}

async function createTreeRequest(repo: string, branch: string) {
  const headers = new Headers();
  headers.append('User-Agent', 'AminoffZ/github-repo-size');
  const token = await getToken();
  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }
  const request = new Request(API(repo, branch), {
    headers,
  });
  return request;
}

async function getDefaultBranch() {
  let branch = '';
  await fetch('https://api.github.com/repos/harshjv/github-repo-size')
    .then(async (res) => {
      const data = await res.json();
      branch = data.default_branch;
    })
    .catch(async (err) => console.error(err));
  return branch;
}

export async function getRepoInfo(
  repo: string,
  branch: string = 'main',
  attempts: number = 0
): Promise<GitHubTree | undefined> {
  const request = await createTreeRequest(repo, branch);
  const response = await fetch(request)
    .then(async (res) => {
      if (!res.ok && res.status === 404 && res.type === 'cors') {
        if (attempts < 1) {
          const defaultBranch = await getDefaultBranch();
          return getRepoInfo(repo, defaultBranch, attempts + 1);
        }
      }

      const data = await res.json();
      return data as GitHubTree;
    })
    .catch((err) => {
      console.error(err.message);
      return undefined;
    });
  return response;
}
