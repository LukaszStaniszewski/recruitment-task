import { ChangeDetectionStrategy, Component, inject, input, linkedSignal, signal } from '@angular/core';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FileBrowserTreeComponent } from './components';
import { MatCardModule } from '@angular/material/card';
import { DownloadFileService } from '@core/services';
import { ActivatedRoute } from '@angular/router';
import { FileNode, FolderNode, NodeType } from './model';

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
      canDelete: true,
      canDownload: true,
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
