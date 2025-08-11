export interface FolderNode {
  readonly id: number;
  readonly name: string;
  readonly type: NodeType;
  readonly children?: Array<FileNode | FolderNode>;
}

export interface FileNode {
  readonly id: number;
  readonly type: NodeType;
  readonly file: File;
  readonly canDelete: boolean;
  readonly canDownload: boolean;
}

export const enum NodeType {
  Folder = 1,
  File = 2,
}
