import { Injectable } from '@angular/core';
import { FileNode, FolderNode, NodeType } from '../model';

@Injectable({
  providedIn: 'root',
})
export class FileTreeService {
  appendFiles(nodes: FolderNode[], parentFolderId: number, filesToAppend: FileNode[]): FolderNode[] {
    return this.updateFolders(nodes, (folder) => {
      if (folder.id !== parentFolderId) {
        return folder;
      }

      return {
        ...folder,
        children: [...(folder.children ?? []), ...filesToAppend],
      };
    });
  }

  removeFile(nodes: FolderNode[], fileId: number): FolderNode[] {
    return this.updateFolders(nodes, (folder) => {
      if (!folder.children || folder.children.length === 0) {
        return folder;
      }

      const updatedChildren = folder.children.filter(
        (child) => !(child.type === NodeType.File && (child as FileNode).id === fileId)
      );

      return {
        ...folder,
        children: updatedChildren,
      };
    });
  }

  private updateFolders(nodes: FolderNode[], mutator: (folder: FolderNode) => FolderNode): FolderNode[] {
    const recurse = (folder: FolderNode): FolderNode => {
      const processedChildren = (folder.children ?? []).map((child) => {
        if (child.type === NodeType.Folder) {
          return recurse(child as FolderNode);
        }
        return child;
      });

      const withProcessedChildren: FolderNode =
        folder.children && folder.children.length > 0 ? { ...folder, children: processedChildren } : folder;

      return mutator(withProcessedChildren);
    };

    return nodes.map(recurse);
  }
}
