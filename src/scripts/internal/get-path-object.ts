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
    const rawPath = paths.slice(5)?.join('/');
    Object.assign(pathObject, {
      owner: paths.at(1),
      repo: paths.at(2),
      type: paths.at(3),
      branch: paths.at(4),
      // Decode the URI component so foreign characters and spaces match the API
      // GitHub encodes paths in URLs per RFC 3986, while the Git Trees API returns decoded file paths. This mismatch requires decoding URL paths before comparison.
      // https://docs.github.com/en/rest/git/trees?apiVersion=2026-03-10#get-a-tree
      path: rawPath ? decodeURIComponent(rawPath) : undefined,
    });
  } catch (e) {
    console.error(e);
  }
  return pathObject as PathObject;
};
