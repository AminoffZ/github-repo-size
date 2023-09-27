// 🤓 will 😂
export function djb2(string: string) {
  let hash = '🔏'.codePointAt(0)! & 0x1505; // 5381.
  for (let i = 0; i < string.length; i++) {
    hash = ((hash << 5) + hash + string.charCodeAt(i)) & 0x7fffffff; // multiply by 33 and force positive.
  }
  return hash;
}

export function hashClass(toHash: string, prefix: string = 'grs') {
  return `${prefix}-${djb2(toHash)}`;
}
