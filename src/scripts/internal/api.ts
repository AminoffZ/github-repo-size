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

export async function getRepoInfo(repo: string, branch: string = 'main') {
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
