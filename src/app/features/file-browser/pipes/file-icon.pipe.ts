import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileIcon',
})
export class FileIconPipe implements PipeTransform {
  transform(fileName?: string | null): string {
    if (!fileName || typeof fileName !== 'string') {
      return 'insert_drive_file';
    }

    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'picture_as_pdf';
      case 'doc':
      case 'docx':
        return 'description';
      case 'xls':
      case 'xlsx':
        return 'grid_on';
      case 'ppt':
      case 'pptx':
        return 'slideshow';
      case 'txt':
        return 'article';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
        return 'image';
      case 'mp4':
      case 'mov':
      case 'avi':
        return 'movie';
      case 'mp3':
      case 'wav':
        return 'audio_file';
      case 'zip':
      case 'rar':
      case '7z':
        return 'folder_zip';
      case 'json':
      case 'ts':
      case 'js':
      case 'html':
      case 'css':
      case 'scss':
        return 'code';
      default:
        return 'insert_drive_file';
    }
  }
}
