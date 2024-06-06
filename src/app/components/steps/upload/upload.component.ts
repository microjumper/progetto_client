import { Component } from '@angular/core';
import { NgForOf, NgIf } from "@angular/common";
import { RouterLink } from "@angular/router";
import { HttpResponse } from "@angular/common/http";

import { FileBeforeUploadEvent, FileUploadEvent, FileUploadModule } from "primeng/fileupload";
import { CardModule } from "primeng/card";

import { filter, Subscription } from "rxjs";

import { BookingService } from "../../../services/booking/booking.service";
import { AuthService } from "../../../services/auth/auth.service";
import { FileMetadata } from "../../../../../progetto_shared/fileMetadata.type";

@Component({
  selector: 'app-upload',
  standalone: true,
    imports: [
        FileUploadModule,
        NgIf,
        NgForOf,
        CardModule,
        RouterLink
    ],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss'
})
export class UploadComponent {

  readonly uploadUrl = "http://localhost:7071/api/documents/upload";
  uploadedFiles: File[] = [];

  constructor(private bookingService: BookingService, private authService: AuthService) { }

  onBeforeUpload(event: FileBeforeUploadEvent) {
    const subscription: Subscription = this.authService.getActiveAccount().pipe(
      filter(account => !!account)).subscribe({
      next: (account) => {
        const accountId =  account?.homeAccountId!;
        const accountEmail = account?.username!;
        event.formData.append("accountId", accountId);
        event.formData.append("accountEmail", accountEmail);
      },
      error: (error) => console.error(error),
      complete: () => subscription.unsubscribe()
    });
  }

  onUpload(event: FileUploadEvent) {  // called when the upload is completed
    const httpResponse = event.originalEvent as HttpResponse<any>;
    const fileMetadata: FileMetadata[] = httpResponse.body;

    this.uploadedFiles = event.files;

    this.bookingService.appointment$.next({ ...this.bookingService.appointment$.value, fileMetadata });

    const subscription: Subscription = this.bookingService.bookAppointment().subscribe({
      next: (appointment) => {
        console.log(appointment);
      },
      error: (error) => console.error(error),
      complete: () => subscription.unsubscribe()
    });
  }

  onError(event: any) {
    console.error(event.error.message)
  }

  onBack(): void {
    this.bookingService.appointment$.next({ ...this.bookingService.appointment$.value, eventDate: undefined });
  }
}
