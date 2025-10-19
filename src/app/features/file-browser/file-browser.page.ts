import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { FileBrowserTreeComponent } from './components';
import { MatCardModule } from '@angular/material/card';
import { DownloadFileService, UserService } from '@core/services';
import { ActivatedRoute } from '@angular/router';
import { FileNode, FolderNode, NodeType } from './model';
import { FileBrowserMapperService, FileBrowserMockApiService, FileTreeService } from './services';
import { User } from '@core/models';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-file-browser',
  templateUrl: './file-browser.page.html',
  styleUrl: './file-browser.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatTreeModule,
    MatButtonModule,
    MatIconModule,
    FileBrowserTreeComponent,
    MatCardModule,
    MatSelectModule,
    AsyncPipe,
  ],
})
export class FileBrowserPage {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly fileService = inject(DownloadFileService);
  private readonly fileTree = inject(FileTreeService);
  private readonly userService = inject(UserService);

  private fileBrowserMapperService = inject(FileBrowserMapperService);
  private fileBrowserMockApiService = inject(FileBrowserMockApiService);

  readonly user$ = this.userService.user$;

  readonly users$ = this.userService.users$;

  compareUsers = (u1: User, u2: User) => u1 && u2 && u1.id === u2.id;

  dataSource = signal<FolderNode[]>(this.activatedRoute.snapshot.data['fileNodes']);

  onDownload({ file }: FileNode): void {
    this.fileService.downloadFile(file, file.name);
  }

  onDelete(fileId: number): void {
    this.dataSource.update((data) => this.fileTree.removeFile(data, fileId));
  }

  onSelectUser({ value }: MatSelectChange<User>) {
    const updatedDataSource = this.fileBrowserMapperService.mapFrom({
      dto: this.fileBrowserMockApiService.DATA,
      userId: value.id,
    });
    this.userService.setUser(value);
    this.dataSource.set(updatedDataSource);
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

    this.dataSource.update((data) => this.fileTree.appendFiles(data, parentFolderId, fileNodes));
  }
}
