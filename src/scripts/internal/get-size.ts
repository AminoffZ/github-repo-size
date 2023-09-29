import type { GitHubTreeItem, PathObject } from './types';

/**
 * Get the size of a path object.
 *
 * @param anchorPath - The path object
 * @param tree - The tree
 * @returns The size of the path object
 * @example
 * ```ts
 * getSize({
 *  owner: 'AminoffZ',
 *  repo: 'github-repo-size',
 *  type: 'blob',
 *  branch: 'main',
 *  path: '.prettierrc',
 *  }, tree);
 * // 85
 * ```
 */
export function getSize(anchorPath: PathObject, tree: GitHubTreeItem[]) {
  let size = 0;
  if (anchorPath.type === 'blob') {
    return tree.find((item) => item.path === anchorPath.path)?.size ?? 0;
  }
  const nestedItems = tree.filter((item) => {
    return item.path.startsWith(anchorPath.path + '/');
  });
  nestedItems.forEach((item) => {
    size += item.size ?? 0;
  });
  return size;
}
