import { GITHUB_TOKEN_KEY, OAUTH_TOKEN_KEY, storage } from '.';

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
