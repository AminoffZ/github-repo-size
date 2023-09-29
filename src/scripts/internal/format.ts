/**
 * Formats a number to a string with a given amount of decimals.
 *
 * @param bytes - The number to format
 * @param decimals - The number of decimals
 * @returns The formatted string
 * @example
 * ```ts
 * formatBytes(1024);
 * // '1 KB'
 * ```
 * @example
 * ```ts
 * formatBytes(1024, 2);
 * // '1.00 KB'
 * ```
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
