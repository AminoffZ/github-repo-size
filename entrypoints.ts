import { readdir } from 'fs/promises';
import { extname, join } from 'path';

const sourceDir = './src/scripts';

/**
 * Recursively get all .ts and .js entrypoints from the directory
 *
 * @param dir Directory path to scan
 * @returns {Promise<string[]>} The entrypoints
 */
async function getFiles(options?: {
  root?: string;
  deep?: boolean;
}): Promise<string[]> {
  const dir = options?.root ?? sourceDir;
  const deep = options?.deep ?? false;
  const dirents = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map((dirent) => {
      const res = join(dir, dirent.name);
      if (dirent.isDirectory() && deep) {
        return getFiles({ ...options, root: res });
      } else {
        return Promise.resolve(res);
      }
    })
  );

  // Flatten the array and filter only .ts and .js files
  return Array.prototype
    .concat(...files)
    .filter((file) => ['.ts', '.js'].includes(extname(file)));
}

/**
 * Get all entrypoints from the src directory
 *
 * @returns {Promise<string[]>} The entrypoints
 */
export default async function entryPoints(options?: {
  root?: string;
  deep?: boolean;
}): Promise<string[]> {
  return await getFiles(options);
}
