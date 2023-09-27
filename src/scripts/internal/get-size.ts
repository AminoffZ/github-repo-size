import type { GitHubTreeItem, PathObject } from './types';

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
