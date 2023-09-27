import type { PathObject } from './types';

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
