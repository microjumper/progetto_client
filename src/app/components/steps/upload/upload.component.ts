import { Component } from '@angular/core';
import { NgForOf, NgIf } from "@angular/common";

import { FileUploadEvent, FileUploadModule } from "primeng/fileupload";

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [
    FileUploadModule,
    NgIf,
    NgForOf
  ],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss'
})
export class UploadComponent {

  uploadedFiles: any[] = [];

  onUpload(event: FileUploadEvent) {
    console.log(event.files)
  }
}
