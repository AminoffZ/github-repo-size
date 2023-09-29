import { GITHUB_TOKEN_KEY, OAUTH_TOKEN_KEY, storage } from '.';

/**
 * Get the token from the storage. If the token is not found, return undefined.
 *
 * @returns The token
 * @example
 * ```ts
 * getToken();
 * // 'ghp_abcdefghijklmnopqrstuvwxyzABCD012345'
 * ```
 */
export const getToken = async () => {
  const oauthToken: string | undefined = (await storage.get(OAUTH_TOKEN_KEY))[
    OAUTH_TOKEN_KEY
  ];
  const githubToken: string | undefined = (await storage.get(GITHUB_TOKEN_KEY))[
    GITHUB_TOKEN_KEY
  ];
  const token = githubToken || oauthToken;
  return token;
};
