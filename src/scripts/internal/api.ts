import { getToken, setDefaultBranch } from '../../shared';
import type { GitHubTree } from './types';

/**
 * Get the API URL.
 *
 * @param repo - The repo name
 * @param branch - The branch name
 * @returns The API URL
 * @example
 * ```ts
 * API('AminoffZ/github-repo-size', 'main');
 * // 'https://api.github.com/repos/AminoffZ/github-repo-size/git/trees/main?recursive=1'
 * ```
 */
function API(repo: string, branch: string) {
  return `https://api.github.com/repos/${repo}/git/trees/${branch}?recursive=1`;
}

/**
 * Generate the headers for the request, includes the token if it exists.
 * @returns The headers object
 * @example
 * ```ts
 * createHeaders();
 * // Headers {
 * //   'User-Agent': 'AminoffZ/github-repo-size',
 * //   'Authorization': 'Bearer ...'
 * // }
 * ```
 */
async function createHeaders() {
  const headers = new Headers();
  headers.append('User-Agent', 'AminoffZ/github-repo-size');
  const token = await getToken();
  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }
  return headers;
}

/**
 * Create a tree request object.
 *
 * @param repo - The repo name
 * @param branch - The branch name
 * @returns The tree request object
 * @example
 * ```ts
 * createTreeRequest('AminoffZ/github-repo-size', 'main');
 * // Request {
 * //   url: 'https://api.github.com/repos/AminoffZ/github-repo-size/git/trees/main?recursive=1',
 * //   method: 'GET',
 * //   headers: Headers { 'User-Agent': 'AminoffZ/github-repo-size' },
 * //   ...
 * // }
 * ```
 */
async function createTreeRequest(repo: string, branch: string) {
  const headers = await createHeaders();
  const request = new Request(API(repo, branch), {
    headers,
  });
  return request;
}

/**
 * Get the default branch of a repo from the GitHub API.
 *
 * @returns The default branch name
 * @example
 * ```ts
 * getDefaultBranch();
 * // 'main'
 * ```
 */
async function getDefaultBranch(repo: string) {
  let branch = '';
  const headers = await createHeaders();
  await fetch(`https://api.github.com/repos/${repo}`, { headers })
    .then(async (res) => {
      const data = await res.json();
      branch = data.default_branch;
    })
    .catch(async (err) => console.error(err));
  return branch;
}

/**
 * Check if the response has errors.
 *
 * @param res - The response
 * @returns True if the response has errors
 * @example
 * ```ts
 * hasErrors(res);
 * // false
 * ```
 */
async function hasErrors(res: Response) {
  return !res.ok && res.status === 404 && res.type === 'cors';
}

/**
 * Get the repo info from the GitHub API using the repo name and branch name.
 * If the request fails, assume that the branch name is incorrect and try again.
 * If the default branch name is not found, the function will return undefined.
 *
 * @param repo - The repo name
 * @param branch - (Optional) The branch name (default: 'main')
 * @param attempts - The number of attempts
 * @returns The repo info
 * @example
 * ```ts
 * getRepoInfo('AminoffZ/github-repo-size');
 * // {
 * //   sha: '...',
 * //   url: '...',
 * //   tree: [
 * //     {
 * //       path: '...',
 * //       mode: '...',
 * //       type: '...',
 * //       sha: '...',
 * //       size: 0,
 * //       url: '...',
 * //     },
 * //     ...
 * //   ],
 * //   truncated: false,
 * // }
 */
export async function getRepoInfo(
  repo: string,
  branch: string = 'main',
  attempts: number = 0
): Promise<GitHubTree | undefined> {
  const branchName = (await getDefaultBranch(repo)) || branch;
  const request = await createTreeRequest(repo, branchName);
  const response = await fetch(request).then(async (res) => {
    if (await hasErrors(res)) {
      if (attempts < 1) {
        const defaultBranch = await getDefaultBranch(repo);
        return getRepoInfo(repo, defaultBranch, attempts + 1);
      }
    }
    if (attempts > 0) {
      await setDefaultBranch(repo, branch);
    }
    const data = await res.json();
    return data as GitHubTree;
  });
  return response;
}
