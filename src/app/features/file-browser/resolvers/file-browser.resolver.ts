import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { FileNode, FolderNode, NodeType as UiNodeType } from '../file-browser.page';
import { inject } from '@angular/core';
import {
  FileBrowserMockApiService,
  FileNodeDto,
  FolderNodeDto,
  NodeType as DtoNodeType,
} from '../services/file-browser-mock.api.service';
import { User, UserId } from '@core/models';
import { map } from 'rxjs';

function mapDtoToUi(dto: FolderNodeDto | FileNodeDto, currentUser: User | undefined): FolderNode | FileNode | null {
  // Admin sees all; non-admins see only their own files
  const isAdmin = currentUser?.id === UserId.Admin;

  if (dto.type === DtoNodeType.File) {
    const fileDto = dto as FileNodeDto;
    if (!isAdmin && currentUser && fileDto.ownerId !== currentUser.id) {
      return null;
    }
    const fileNode: FileNode = {
      id: fileDto.id,
      type: UiNodeType.File,
      file: fileDto.file,
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
    type: UiNodeType.Folder,
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
