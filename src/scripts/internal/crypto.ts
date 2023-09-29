// 🤓 will 😂
/**
 * djb2 hash function.
 *
 * @param string - The string to hash
 * @returns The hash
 * @example
 * ```ts
 * djb2('💩');
 * // 7743179
 * ```
 */
function djb2(string: string) {
  let hash = '🔏'.codePointAt(0)! & 0x1505; // 5381.
  for (let i = 0; i < string.length; i++) {
    hash = ((hash << 5) + hash + string.charCodeAt(i)) & 0x7fffffff; // multiply by 33 and force positive.
  }
  return hash;
}

/**
 * Hash a string to a class name.
 *
 * @param toHash - The string to hash
 * @param prefix - The prefix of the class name
 * @returns The class name
 * @example
 * ```ts
 * hashClass('💩', 'grs');
 * // 'grs-7743179'
 * ```
 */
export function hashClass(toHash: string, prefix: string = 'grs') {
  return `${prefix}-${djb2(toHash)}`;
}
