import { ChangeDetectionStrategy, Component, HostListener, output } from '@angular/core';

@Component({
  selector: 'ui-drag-drop',
  templateUrl: './drag-drop.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class DragDropComponent {
  filesDropped = output<FileList>();

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.filesDropped.emit(files);
    }
  }
}
