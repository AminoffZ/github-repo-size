import type { PathObject } from './types';

/**
 * Get the path object from a path string
 *
 * @param path - The path string
 * @returns PathObject
 * @example
 * ```ts
 * getPathObject('/owner/repo/tree/branch/path/to/file');
 * // {
 * //   owner: 'owner',
 * //   repo: 'repo',
 * //   type: 'tree',
 * //   branch: 'branch',
 * //   path: 'path/to/file',
 * // }
 * ```
 */
export const getPathObject = (path?: string) => {
  path = path ?? window.location.pathname;
  const pathObject = {};
  try {
    const paths = path.split('/');
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
};
