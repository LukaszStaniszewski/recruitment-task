import { Injectable } from '@angular/core';
import { UserId } from '@core/models';
import { Observable, of } from 'rxjs';
import { FolderNodeDto, NodeType } from '../model';

// export interface FolderNodeDto {
//   id: number;
//   name: string;
//   type: NodeType;
//   children?: Array<FileNodeDto | FolderNodeDto>;
// }

// export interface FileNodeDto {
//   id: number;
//   type: NodeType;
//   file: File;
//   ownerId: UserId;
// }

// export const enum NodeType {
//   Folder = 1,
//   File = 2,
// }

@Injectable({
  providedIn: 'root',
})
export class FileBrowserMockApiService {
  private DATA: FolderNodeDto[] = [
    {
      id: 1,
      name: 'PROJEKTY',
      type: NodeType.Folder,
      children: [
        {
          id: 2,
          name: 'Klient ABC',
          type: NodeType.Folder,
        },
        {
          id: 3,
          name: 'Klient XYZ',
          type: NodeType.Folder,
          children: [
            {
              id: 4,
              name: 'COMMON',
              type: NodeType.Folder,
              children: [
                {
                  id: 11,
                  type: NodeType.File,
                  file: new File(['Hello from User1'], 'user1-notes.txt', {
                    type: 'text/plain;charset=utf-8',
                  }),
                  ownerId: UserId.User1,
                },
                {
                  id: 13,
                  type: NodeType.File,
                  file: new File(['Hello from User2'], 'user2-notes.txt', {
                    type: 'text/plain;charset=utf-8',
                  }),
                  ownerId: UserId.User2,
                },
                {
                  id: 14,
                  type: NodeType.File,
                  file: new File(['Hello from Admin'], 'admin-notes.txt', {
                    type: 'text/plain;charset=utf-8',
                  }),
                  ownerId: UserId.Admin,
                },
              ],
            },
            {
              id: 5,
              name: '2022 Wizytówka',
              type: NodeType.Folder,
            },
            {
              id: 6,
              name: '2025 Plakat',
              type: NodeType.Folder,
              children: [
                {
                  id: 7,
                  name: 'Links',
                  type: NodeType.Folder,
                },
                {
                  id: 8,
                  name: 'Materials',
                  type: NodeType.Folder,
                },
                {
                  id: 9,
                  name: 'Old',
                  type: NodeType.Folder,
                },
                {
                  id: 10,
                  name: 'Out',
                  type: NodeType.Folder,
                },
              ],
            },
            {
              id: 12,
              type: NodeType.File,
              file: new File(['Spec'], 'design-by-admin.doc', {
                type: 'application/msword',
              }),
              ownerId: UserId.Admin,
            },
          ],
        },
      ],
    },
  ];

  getfolderNodes(): Observable<FolderNodeDto[]> {
    return of(this.DATA);
  }
}
