import { UserId } from '@core/models';
import { NodeType } from '../model';

export type FileBrowserNodeDto = FolderNodeDto | FileNodeDto;

export interface FolderNodeDto {
  readonly id: number;
  readonly name: string;
  readonly type: NodeType;
  readonly children?: FileBrowserNodeDto[];
}

export interface FileNodeDto {
  readonly id: number;
  readonly type: NodeType;
  readonly file: File;
  readonly ownerId: UserId;
}
