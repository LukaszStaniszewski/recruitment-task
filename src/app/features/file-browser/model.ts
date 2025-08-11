export interface FolderNode {
  readonly id: number;
  readonly name: string;
  readonly type: NodeType.Folder;
  readonly children?: FileBrowserNode[];
}

export interface FileNode {
  readonly id: number;
  readonly type: NodeType.File;
  readonly file: File;
  readonly canDelete: boolean;
  readonly canDownload: boolean;
}

export const enum NodeType {
  Folder = 1,
  File = 2,
}

export type FileBrowserNode = FolderNode | FileNode;
