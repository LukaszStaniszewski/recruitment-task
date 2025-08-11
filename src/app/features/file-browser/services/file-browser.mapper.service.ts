import { Injectable } from '@angular/core';
import { Mapper } from '@core/mappers';
import { User, UserId } from '@core/models';
import { FileBrowserNodeDto, FileNodeDto, FolderNodeDto } from './file-browser-dto.model';
import { FileNode, FolderNode, NodeType, FileBrowserNode } from '../model';

export type MapInput = {
  dto: FileBrowserNodeDto[];
  currentUser: User;
};

@Injectable({
  providedIn: 'root',
})
export class FileBrowserMapperService extends Mapper<MapInput, FolderNode[]> {
  mapFrom({ dto, currentUser }: MapInput): FolderNode[] {
    return dto
      .map((dto) => this.mapNode(dto, currentUser))
      .filter((node): node is FolderNode => node !== null && node.type === NodeType.Folder);
  }

  private mapNode(dto: FileBrowserNodeDto, currentUser: User): FileBrowserNode | null {
    const isAdmin = currentUser?.id === UserId.Admin;

    if (dto.type === NodeType.File) {
      const fileDto = dto as FileNodeDto;
      if (!isAdmin && !(fileDto.ownerId === currentUser.id || fileDto.ownerId === UserId.Admin)) {
        return null;
      }
      const fileNode: FileNode = {
        id: fileDto.id,
        type: NodeType.File,
        file: fileDto.file,
        canDelete: isAdmin || fileDto.ownerId === currentUser.id,
        canDownload: isAdmin || fileDto.ownerId === currentUser.id,
      };
      return fileNode;
    }

    const folderDto = dto as FolderNodeDto;
    const children = (folderDto.children ?? [])
      .map((child) => this.mapNode(child, currentUser))
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
