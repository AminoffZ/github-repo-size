/**
 * OAuth token key. Used to store the OAuth token in the storage. The token is
 * used to authenticate requests to the GitHub API, increasing the rate limit.
 */
export const OAUTH_TOKEN_KEY = 'repo-size-oauth-token';
/**
 * GitHub PAT. Used to store the GitHub PAT in the storage.
 * The token is used to authenticate requests to the GitHub API
 * to see the sizes of private repos.
 */
export const GITHUB_TOKEN_KEY = 'x-github-token';
