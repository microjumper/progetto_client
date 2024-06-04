import { Component } from '@angular/core';
import { JsonPipe, NgForOf, NgIf } from "@angular/common";

import { FileUploadEvent, FileUploadModule } from "primeng/fileupload";
import { CardModule } from "primeng/card";
import { RouterLink } from "@angular/router";
import { BookingService } from "../../../services/booking/booking.service";

@Component({
  selector: 'app-upload',
  standalone: true,
    imports: [
        FileUploadModule,
        NgIf,
        NgForOf,
        JsonPipe,
        CardModule,
        RouterLink
    ],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss'
})
export class UploadComponent {

  uploadUrl = "http://localhost:7071/api/documents/upload";
  uploadedFiles: File[] = [];

  constructor(private bookingService: BookingService) {
  }

  onSend(event: { originalEvent: object, formData: FormData}) {
    console.log(event.formData)
  }

  onUpload(event: FileUploadEvent) {
    this.uploadedFiles = event.files;
    console.log(event);
    console.log(event.files)
  }

  onError(event: any) {
    console.error(event.error.message)
  }

  deleteFile(file: File): void {

  }

  onBack(): void {
    this.bookingService.appointment$.next({ ...this.bookingService.appointment$.value, eventDate: undefined });
  }
}
