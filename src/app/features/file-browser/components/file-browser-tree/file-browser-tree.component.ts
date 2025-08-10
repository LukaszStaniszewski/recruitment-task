import { ChangeDetectionStrategy, Component, input, output, ViewChild, AfterViewInit, effect } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTree, MatTreeModule } from '@angular/material/tree';
import { FileNode, FolderNode, NodeType } from '../../pages/file-browser.page';
import { DragDropComponent } from '@ui/drag-drop';

@Component({
  selector: 'app-file-browser-tree',
  templateUrl: 'file-browser-tree.component.html',
  styleUrl: 'file-browser-tree.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatTreeModule, MatButtonModule, MatIconModule, DragDropComponent],
})
export class FileBrowserTreeComponent implements AfterViewInit {
  @ViewChild('tree') private tree?: MatTree<FolderNode | FileNode>;
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

  childrenAccessor = (node: FolderNode): FolderNode[] => (node.children ?? []) as FolderNode[];

  isExpandableFolder = (_: number, node: FolderNode): boolean =>
    !!node.children && node.children.length > 0 && node.type === NodeType.Folder;

  isFile = (_: number, node: FolderNode): boolean => node.type === NodeType.File;

  isNonExpandableFolder = (_: number, node: FolderNode): boolean =>
    !node.children || (node.children.length === 0 && node.type === NodeType.Folder);

  ngAfterViewInit(): void {
    this.tree?.expandAll();
  }
}
