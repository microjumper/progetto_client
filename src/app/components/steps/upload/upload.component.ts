import { Component } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { HttpResponse } from "@angular/common/http";

import {
  FileBeforeUploadEvent,
  FileSelectEvent,
  FileUpload,
  FileUploadEvent,
  FileUploadModule
} from "primeng/fileupload";
import { CardModule } from "primeng/card";

import { ConfirmationService, MessageService } from "primeng/api";

import { filter, Subscription, switchMap, tap } from "rxjs";

import { BookingService } from "../../../services/booking/booking.service";
import { AuthService } from "../../../services/auth/auth.service";
import { FileMetadata } from "../../../../../progetto_shared/fileMetadata.type";

@Component({
  selector: 'app-upload',
  standalone: true,
    imports: [
        FileUploadModule,
        CardModule,
        RouterLink
    ],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss'
})
export class UploadComponent {

  readonly uploadUrl = "http://localhost:7071/api/documents/upload";

  private filesToUpload: File[] = [];

  constructor(private bookingService: BookingService, private authService: AuthService,private confirmationService: ConfirmationService, private messageService: MessageService, private router: Router) { }

  onSelect(event: FileSelectEvent): void {
    this.filesToUpload = event.files
  }

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

    this.bookingService.appointment$.next({ ...this.bookingService.appointment$.value, fileMetadata });

    this.book();

    this.filesToUpload = [];
  }

  onError(event: any) {
    console.error(event.error.message)
  }

  onBook(uploader: FileUpload): void {
    if(this.filesToUpload.length > 0) {
      this.confirmationService.confirm({
        message: 'Procedere con la prenotazione?',
        header: 'Conferma prenotazione',
        icon: 'pi pi-exclamation-triangle',
        acceptIcon: "none",
        rejectIcon: "none",
        accept: () => uploader.upload(),
        reject: () => { }
      });
    }
    else {
      this.confirmationService.confirm({
        message: 'Procedere senza allegati?',
        header: 'Stai prenotando senza allegare documenti',
        icon: 'pi pi-exclamation-triangle',
        acceptIcon: "none",
        rejectIcon: "none",
        accept: () => this.book(),
        reject: () => { }
      });
    }
  }

  private book(): void {
    const subscription: Subscription = this.authService.getActiveAccount()
      .pipe(
        filter(account => !!account),
        tap(account =>
          this.bookingService.appointment$.next({...this.bookingService.appointment$.value, accountId: account?.homeAccountId!})
        ),
        switchMap(account => this.bookingService.bookAppointment())
      ).subscribe({
        next: (appointment) => {
          this.messageService.add({ severity: 'success', summary: 'Successo', detail: 'Prenotazione effettuata',  life: 1500 });

          // clean up
          this.bookingService.appointment$.next(null);
          subscription.unsubscribe();

          this.router.navigate(["/", "schedule"]);
        },
        error: (error) => console.error(error)
      });
  }
}
