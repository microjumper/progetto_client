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
import { Confirmation, ConfirmationService, MessageService } from "primeng/api";

import { filter, firstValueFrom, Subscription, switchMap, tap } from "rxjs";

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

  constructor(private bookingService: BookingService, private authService: AuthService, private confirmationService: ConfirmationService, private messageService: MessageService, private router: Router) { }

  onSelect(event: FileSelectEvent): void {
    this.filesToUpload = event.files
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

    this.book()
      .then(r => this.filesToUpload = [])
      .catch(e => console.error(e));
  }

  onBook(uploader: FileUpload): void {
    if(!this.bookingService.appointment$.value?.eventId)
    {
      this.confirmationService.confirm(
        this.setupConfirmation(
          'Riceverai un\'email se un appuntamento sarà disponibile',
          'Vuoi metterti in lista d\'attesa?',
          this.addToWaitingList.bind(this)
        )
      );
      return;
    }

    if (this.filesToUpload.length > 0) {
      this.confirmationService.confirm(
        this.setupConfirmation(
          'Procedere con la prenotazione?',
          'Conferma prenotazione',
          uploader.upload.bind(uploader) // first upload then book
        )
      );
    }
    else {
      this.confirmationService.confirm(
        this.setupConfirmation(
          'Procedere senza allegati?',
          'Stai prenotando senza allegare documenti',
          this.book.bind(this)
        )
      );
    }
  }

  private setupConfirmation(message: string, header: string, acceptCallback: Function): Confirmation {
    return {
      message,
      header,
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: "none",
      rejectIcon: "none",
      accept: () => acceptCallback(),
      reject: (): void => {}
    };
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
