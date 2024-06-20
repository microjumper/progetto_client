import { Component } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { HttpResponse } from "@angular/common/http";

import {
  FileBeforeUploadEvent,
  FileUpload,
  FileUploadEvent,
  FileUploadModule
} from "primeng/fileupload";
import { CardModule } from "primeng/card";
import { ConfirmationService, MessageService } from "primeng/api";

import { filter, firstValueFrom, Subscription } from "rxjs";

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

  readonly uploadUrl: string;

  constructor(private bookingService: BookingService, private authService: AuthService, private confirmationService: ConfirmationService, private messageService: MessageService, private router: Router) {
    if(window.location.hostname === "localhost") {
      this.uploadUrl = "http://localhost:7071/api/documents/upload";
    }
    else {
      this.uploadUrl = `https://appointment-scheduler.azurewebsites.net/api/documents/upload?code=${process.env['UPLOAD_CODE']}`;
    }
  }

  onBeforeUpload(event: FileBeforeUploadEvent) {
    const subscription: Subscription = this.authService.getActiveAccount()
      .pipe(
        filter(account => !!account)
      ).subscribe({
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

    let promise: Promise<void>;
    if(this.bookingService.appointment$.value?.eventId) {
      promise = this.book();
    }
    else {
      promise = this.addToWaitingList();
    }
    promise.then().catch(e => console.error(e));
  }

  onBook(uploader: FileUpload): void {
    if (uploader.files.length > 0) {
      this.confirmationService.confirm({
        message: this.bookingService.appointment$.value?.eventId ? 'Procedere con la prenotazione?' : 'Vuoi metterti in lista d\'attesa?',
        header: 'Conferma operazione',
        icon: 'pi pi-exclamation-triangle',
        acceptIcon: "none",
        rejectIcon: "none",
        accept: () => uploader.upload(), // first upload then book or add user to waiting list
        reject: (): void => {}
      });
    }
    else {
      this.confirmationService.confirm({
          message: 'Procedere senza allegati?',
          header: this.bookingService.appointment$.value?.eventId ? 'Stai prenotando senza allegare documenti' : 'Sarai messo in lista d\'attesa senza allegati',
          icon: 'pi pi-exclamation-triangle',
          acceptIcon: "none",
          rejectIcon: "none",
          accept: () => {
            if(this.bookingService.appointment$.value?.eventId) {
              this.book().then().catch(e => console.error(e));
            }
            else {
              this.addToWaitingList().then().catch(e => console.error(e))
            }
          },
          reject: (): void => {}
        }
      );
    }
  }

  private async book(): Promise<void> {
    await this.setUser();

    const subscription = this.bookingService.bookAppointment().subscribe({
      next: (appointment) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Operazione eseguita',
          detail: 'Prenotazione effettuata correttamente',  life: 1500 });

        // clean up
        this.bookingService.appointment$.next(null);
        subscription.unsubscribe();

        this.router.navigate(["/", "schedule"]);
      },
      error: (error) => console.error(error)
    });
  }

  private async addToWaitingList(): Promise<void> {
    await this.setUser();

    const subscription = this.bookingService.addToWaitingList().subscribe({
      next: (appointment) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Operazione eseguita',
          detail: 'Aggiunto correttamente in lista',  life: 1500 });

        // clean up
        this.bookingService.appointment$.next(null);
        subscription.unsubscribe();

        this.router.navigate(["/", "schedule"]);
      },
      error: (error) => console.error(error)
    });
  }

  private async setUser(): Promise<void> {
    const accountInfo = await firstValueFrom(this.authService.getActiveAccount());

    this.bookingService.appointment$.next({
      ...this.bookingService.appointment$.value,
      user: {
        id: accountInfo?.homeAccountId!,
        email: accountInfo?.username!
      }
    });
  }
}
