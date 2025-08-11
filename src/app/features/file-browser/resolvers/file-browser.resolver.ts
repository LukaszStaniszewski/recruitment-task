import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';

import { inject } from '@angular/core';

import { User, UserId } from '@core/models';
import { map } from 'rxjs';
import { FileNode, FileNodeDto, FolderNode, FolderNodeDto, NodeType } from '../model';
import { FileBrowserMockApiService } from '../services';

function mapDtoToUi(dto: FolderNodeDto | FileNodeDto, currentUser: User | undefined): FolderNode | FileNode | null {
  // Admin sees all; non-admins see their own files and admin's files
  const isAdmin = currentUser?.id === UserId.Admin;

  if (dto.type === NodeType.File) {
    const fileDto = dto as FileNodeDto;
    if (!isAdmin && currentUser && !(fileDto.ownerId === currentUser.id || fileDto.ownerId === UserId.Admin)) {
      return null;
    }
    const fileNode: FileNode = {
      id: fileDto.id,
      type: NodeType.File,
      file: fileDto.file,
      canDelete: isAdmin || fileDto.ownerId === currentUser?.id,
      canDownload: isAdmin || fileDto.ownerId === currentUser?.id,
    };
    return fileNode;
  }

  const folderDto = dto as FolderNodeDto;
  const children = (folderDto.children ?? [])
    .map((child) => mapDtoToUi(child, currentUser))
    .filter((child): child is FileNode | FolderNode => child !== null);

  const folderNode: FolderNode = {
    id: folderDto.id,
    name: folderDto.name,
    type: NodeType.Folder,
    children: children.length > 0 ? children : undefined,
  };
  return folderNode;
}

export const fileBrowserResolver: ResolveFn<FolderNode[]> = (route: ActivatedRouteSnapshot) => {
  const fileBrowserMockApiService = inject(FileBrowserMockApiService);

  const currentUser: User = route.parent?.data['user'];

  return fileBrowserMockApiService
    .getfolderNodes()
    .pipe(map((nodes) => nodes.map((n) => mapDtoToUi(n, currentUser)).filter((n): n is FolderNode => n !== null)));
};
