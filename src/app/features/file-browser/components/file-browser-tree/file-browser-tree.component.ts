import { ChangeDetectionStrategy, Component, input, output, ViewChild, AfterViewInit, effect } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTree, MatTreeModule } from '@angular/material/tree';
import { DragDropComponent } from '@ui/drag-drop';
import { FileIconPipe } from '../../pipes/file-icon.pipe';
import { FileNode, FolderNode, NodeType, FileBrowserNode } from '@features/file-browser/model';

@Component({
  selector: 'app-file-browser-tree',
  templateUrl: 'file-browser-tree.component.html',
  styleUrl: 'file-browser-tree.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatTreeModule, MatButtonModule, MatIconModule, DragDropComponent, FileIconPipe],
})
export class FileBrowserTreeComponent implements AfterViewInit {
  @ViewChild('tree') private tree?: MatTree<FileBrowserNode>;
  readonly dataSource = input.required<FolderNode[]>();

  readonly handleDownload = output<FileNode>();
  readonly handleDelete = output<number>();
  readonly handleDrop = output<{ event: FileList; parentFolderId: number }>();

  constructor() {
    effect(() => {
      this.dataSource();
      this.tree?.expand(this.dataSource()[0]);
      this.tree?.expandDescendants(this.dataSource()[0]);
    });
  }

  ngAfterViewInit(): void {
    this.tree?.expandAll();
  }

  childrenAccessor = (node: FileBrowserNode): FileBrowserNode[] =>
    node.type === NodeType.Folder ? node.children ?? [] : [];

  isExpandableFolder = (_: number, node: FileBrowserNode): node is FolderNode =>
    node.type === NodeType.Folder && !!node.children && node.children.length > 0;

  isFile = (_: number, node: FileBrowserNode): node is FileNode => node.type === NodeType.File;

  isNonExpandableFolder = (_: number, node: FileBrowserNode): node is FolderNode =>
    node.type === NodeType.Folder && (!node.children || node.children.length === 0);
}
