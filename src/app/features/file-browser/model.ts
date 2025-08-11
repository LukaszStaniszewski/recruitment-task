import { UserId } from '@core/models';

export interface FolderNode {
  id: number;
  name: string;
  type: NodeType;
  children?: Array<FileNode | FolderNode>;
}

export interface FileNode {
  id: number;
  type: NodeType;
  file: File;
  canDelete: boolean;
  canDownload: boolean;
}

export const enum NodeType {
  Folder = 1,
  File = 2,
}

export interface FolderNodeDto {
  id: number;
  name: string;
  type: NodeType;
  children?: Array<FileNodeDto | FolderNodeDto>;
}

export interface FileNodeDto {
  id: number;
  type: NodeType;
  file: File;
  ownerId: UserId;
}
