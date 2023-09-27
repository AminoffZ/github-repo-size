export type PathObject = {
  owner: string | undefined;
  repo: string | undefined;
  type?: string | undefined;
  branch?: string | undefined;
  path?: string | undefined;
};

export type GitHubTreeItem = {
  path: string;
  mode: string;
  type: string;
  sha: string;
  size?: number;
  url: string;
};

export type GitHubTree = {
  sha: string;
  url: string;
  tree: GitHubTreeItem[];
  truncated: boolean;
};

export type GRSUpdate = Array<{
  anchor: HTMLAnchorElement;
  span: HTMLSpanElement;
  index: number;
}>;
