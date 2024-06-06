import { Component } from '@angular/core';
import { NgForOf, NgIf } from "@angular/common";
import { RouterLink } from "@angular/router";

import { FileBeforeUploadEvent, FileUploadEvent, FileUploadModule } from "primeng/fileupload";
import { CardModule } from "primeng/card";

import { BookingService } from "../../../services/booking/booking.service";
import { AuthService } from "../../../services/auth/auth.service";
import { filter, Subscription } from "rxjs";

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

  uploadUrl = "http://localhost:7071/api/documents/upload";
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

  book(): void {

  }
}
