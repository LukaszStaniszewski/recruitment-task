import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';

export type DownloadContent = Blob | File | ArrayBuffer | Uint8Array | string;

@Injectable({ providedIn: 'root' })
export class DownloadFileService {
  downloadFile(content: DownloadContent, fileName: string): void {
    const blob = this.ensureBlob(content);
    saveAs(blob, fileName);
  }

  private ensureBlob(content: DownloadContent): Blob | File {
    if (content instanceof Blob) return content;
    if (content instanceof File) return content;
    if (content instanceof ArrayBuffer || content instanceof Uint8Array)
      return new Blob([content], { type: 'application/octet-stream' });
    return new Blob([content], { type: 'text/plain;charset=utf-8' });
  }
}
