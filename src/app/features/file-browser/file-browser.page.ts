import { ChangeDetectionStrategy, Component, inject, input, linkedSignal, signal } from '@angular/core';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FileBrowserTreeComponent } from './components';
import { MatCardModule } from '@angular/material/card';
import { DownloadFileService } from '@core/services';
import { ActivatedRoute, Router } from '@angular/router';

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
}

export const enum NodeType {
  Folder = 1,
  File = 2,
}

// export type NodeType = 'folder' | 'file'

const EXAMPLE_DATA: FolderNode[] = [
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
                file: new File(['Hello from User1'], 'notes.txt', {
                  type: 'text/plain;charset=utf-8',
                }),
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
            file: new File(['Spec'], 'design.doc', {
              type: 'application/msword',
            }),
          },
        ],
      },
    ],
  },
];

@Component({
  selector: 'app-file-browser',
  templateUrl: './file-browser.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatTreeModule, MatButtonModule, MatIconModule, FileBrowserTreeComponent, MatCardModule],
})
export class FileBrowserPage {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly fileService = inject(DownloadFileService);

  dataSource = signal<FolderNode[]>(this.activatedRoute.snapshot.data['fileNodes']);

  onDownload(node: FileNode): void {
    this.fileService.downloadFile(node.file, node.file.name);
  }

  onDelete(fileId: number): void {
    this.dataSource.update((data) => this.removeFileById(data, fileId));
  }

  onDrop(event: FileList, parentFolderId: number): void {
    const files = Array.from(event);
    if (files.length === 0) return;

    const fileNodes: FileNode[] = files.map((file) => ({
      id: Math.random() * 1000000,
      type: NodeType.File,
      file,
    }));

    this.dataSource.update((data) => this.appendFilesToFolderById(data, parentFolderId, fileNodes));
  }

  private appendFilesToFolderById(
    nodes: FolderNode[],
    parentFolderId: number,
    filesToAppend: FileNode[]
  ): FolderNode[] {
    const updateFolderNode = (folderNode: FolderNode): FolderNode => {
      if (folderNode.id === parentFolderId) {
        return {
          ...folderNode,
          children: [...(folderNode.children ?? []), ...filesToAppend],
        };
      }

      if (!folderNode.children || folderNode.children.length === 0) {
        return folderNode;
      }

      const updatedChildren = folderNode.children.map((child) => {
        if (child.type === NodeType.Folder) {
          return updateFolderNode(child as FolderNode);
        }
        return child;
      });

      return {
        ...folderNode,
        children: updatedChildren,
      };
    };

    return nodes.map(updateFolderNode);
  }

  private removeFileById(nodes: FolderNode[], fileId: number): FolderNode[] {
    const updateFolderNode = (folderNode: FolderNode): FolderNode => {
      if (!folderNode.children || folderNode.children.length === 0) {
        return folderNode;
      }

      const updatedChildren = folderNode.children
        .map((child) => {
          if (child.type === NodeType.Folder) {
            return updateFolderNode(child as FolderNode);
          }
          return child;
        })
        .filter((child) => !(child.type === NodeType.File && (child as FileNode).id === fileId));

      return {
        ...folderNode,
        children: updatedChildren,
      };
    };

    return nodes.map(updateFolderNode);
  }
}
