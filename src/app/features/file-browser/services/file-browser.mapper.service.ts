import { Injectable } from '@angular/core';
import { Mapper } from '@core/mappers';
import { User, UserId } from '@core/models';
import { FileBrowserNodeDto, FileNodeDto, FolderNodeDto } from './file-browser-dto.model';
import { FileNode, FolderNode, NodeType, FileBrowserNode } from '../model';

export type MapInput = {
  dto: FileBrowserNodeDto[];
  userId: UserId;
};

@Injectable({
  providedIn: 'root',
})
export class FileBrowserMapperService extends Mapper<MapInput, FolderNode[]> {
  mapFrom({ dto, userId }: MapInput): FolderNode[] {
    return dto
      .map((dto) => this.mapNode(dto, userId))
      .filter((node): node is FolderNode => node !== null && node.type === NodeType.Folder);
  }

  private mapNode(dto: FileBrowserNodeDto, userId: UserId): FileBrowserNode | null {
    const isAdmin = userId === UserId.Admin;

    if (dto.type === NodeType.File) {
      const fileDto = dto as FileNodeDto;
      if (!isAdmin && !(fileDto.ownerId === userId || fileDto.ownerId === UserId.Admin)) {
        return null;
      }
      const fileNode: FileNode = {
        id: fileDto.id,
        type: NodeType.File,
        file: fileDto.file,
        canDelete: isAdmin || fileDto.ownerId === userId,
        canDownload: isAdmin || fileDto.ownerId === userId,
      };
      return fileNode;
    }

    const folderDto = dto as FolderNodeDto;
    const children = (folderDto.children ?? [])
      .map((child) => this.mapNode(child, userId))
      .filter((child): child is FileBrowserNode => child !== null);

    const folderNode: FolderNode = {
      id: folderDto.id,
      name: folderDto.name,
      type: NodeType.Folder,
      children: children.length > 0 ? children : undefined,
    };
    return folderNode;
  }
}
