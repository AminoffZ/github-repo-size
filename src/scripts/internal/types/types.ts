/**
 * Object to provide context.
 */
export type PathObject = {
  /**
   * The owner of the repository.
   */
  owner: string | undefined;
  /**
   * The repository name.
   */
  repo: string | undefined;
  /**
   * The type of the path.
   */
  type?: PathType | undefined;
  /**
   * The branch name.
   */
  branch?: string | undefined;
  /**
   * The path to the file. Indicates nesting.
   */
  path?: string | undefined;
};

/**
 * The type of the path. A tree represents a directory and a blob represents a file.
 */
export type PathType = 'tree' | 'blob';

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
