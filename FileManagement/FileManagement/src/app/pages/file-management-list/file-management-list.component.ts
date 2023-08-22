import { Component } from '@angular/core';
import { FileService } from 'src/app/services/file-service.service';

@Component({
  selector: 'app-file-management-list',
  templateUrl: './file-management-list.component.html',
  styleUrls: ['./file-management-list.component.scss']
})
export class FileManagementListComponent {
  uploadedFiles: File[] = [];

  selectedAction: string = '';
  newFileName: string = '';
  constructor(private fileService: FileService) {}

  ngOnInit() {}

  onFileSelected(event: any) {
      const file: File[] = event.target.files;
      this.uploadFile(file[0]);
      this.uploadedFiles.push(file[0]);
  }

  deleteFile(filename: string) {
      this.fileService.deleteFile(filename).subscribe(() => {
      });
      this.uploadedFiles = this.uploadedFiles.filter(file => file.name !== filename);
  }
  duplicateFile(filename: string) {
      this.fileService.duplicateFile(filename).subscribe(() => {});
      const file = this.uploadedFiles?.find(c => c.name == filename);
      if (file) {
          const duplicateFile = new File([file], `Copy_${file.name}`);
          this.uploadedFiles?.push(duplicateFile);
      }
  }
  renameFile(oldFilename: string, newFilename: string) {
      this.fileService.renameFile(oldFilename, newFilename).subscribe(() => {});
      const file = this.uploadedFiles?.find(c => c.name === oldFilename);
      if (file) {
          const renameFile = new File([file], newFilename);
          this.uploadedFiles?.push(renameFile);
          this.uploadedFiles = this.uploadedFiles.filter(file => file.name !== oldFilename);
          this.selectedAction = '';
          this.newFileName = '';
      }
  }
  uploadFile(file: File) {
      this.fileService.uploadFile(file).subscribe(() => {});
  }

  downloadFile(filename: string) {
      this.fileService.downloadFile(filename).subscribe(() => {});
  }

  performAction(file: File) {
      switch (this.selectedAction) {
          case 'delete':
              this.deleteFile(file.name);
              break;
          case 'duplicate':
              this.duplicateFile(file.name);
              break;
      }
  }

  onEnterRename(file: File) {
      this.renameFile(file.name, this.newFileName);
  }
}
