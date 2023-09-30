import { storage } from '.';

/**
 * Get the default branch for a repo.
 *
 * @param repo - The repo name
 * @returns The default branch name
 * @example
 * ```ts
 * getDefaultBranch('neovim/neovim');
 * // 'master'
 * ```
 */
export async function getDefaultBranch(repo: string) {
  const storedBranch = await storage.get(repo);
  return storedBranch[repo];
}

/**
 * Set the default branch for a repo.
 *
 * @param repo - The repo name
 * @param branch - The branch name
 * @example
 * ```ts
 * setDefaultBranch('AminoffZ/github-repo-size', 'master');
 * ```
 */
export async function setDefaultBranch(repo: string, branch: string) {
  await storage.set({
    [repo]: branch,
  });
}
