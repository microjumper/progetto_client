import { Component,  OnInit } from '@angular/core';
import { DatePipe, NgForOf } from "@angular/common";
import { RouterLink } from "@angular/router";

import { ButtonDirective } from "primeng/button";
import { FieldsetModule } from "primeng/fieldset";
import { ConfirmationService, MessageService } from "primeng/api";

import { forkJoin, Observable, Subscription, switchMap } from "rxjs";

import { Appointment } from "../../../../progetto_shared/appointment.type";
import { BookingService } from "../../services/booking/booking.service";
import { AuthService } from "../../services/auth/auth.service";
import { WaitingListEntity } from "../../../../progetto_shared/waitingListEntity.type";

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [
    ButtonDirective,
    NgForOf,
    FieldsetModule,
    RouterLink,
    DatePipe
  ],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss'
})
export class ScheduleComponent implements OnInit {

  appointments: Appointment[] = [];
  waitingList: WaitingListEntity[] = [];

  constructor(private bookingService: BookingService, private confirmationService: ConfirmationService, private messageService: MessageService, private authService: AuthService) { }

  ngOnInit(): void {
    this.fetchData();
  }

  cancelAppointment(appointmentID: string, button: HTMLButtonElement) {
    this.confirmationService.confirm({
      message: 'Procedere con la cancellazione dell\'appuntamento?',
      header: 'Conferma cancellazione',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: "none",
      rejectIcon: "none",
      accept: () => {
        button.disabled = true;

        const subscription: Subscription = this.bookingService.cancelAppointment(appointmentID).subscribe({
          next: (response) => {
            this.messageService.add({ severity: 'success', summary: 'Operazione completata', detail: 'Appuntamento cancellato con successo',  life: 1500 });

            setTimeout(() => this.fetchData(), 1000);
          },
          error: (error) => {
            button.disabled = true;

            console.error(error);
          },
          complete: () => subscription.unsubscribe()
        });
      },
      reject: () => { }
    });
  }

  confirmAppointment(appointment: Appointment, confirmButton: HTMLButtonElement, cancelButton: HTMLButtonElement): void {
    this.confirmationService.confirm({
      message: 'Procedere con la conferma dell\'appuntamento?',
      header: 'Conferma appuntamento',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: "none",
      rejectIcon: "none",
      accept: () => {
        confirmButton.disabled = true;
        cancelButton.disabled = true;

        this.bookingService.appointment$.next(appointment);

        const subscription = this.bookingService.bookAppointment().subscribe({
          next: (appointment) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Operazione eseguita',
              detail: 'Prenotazione effettuata correttamente',  life: 1500 });

            setTimeout(() => this.fetchData(), 1000);

            // clean up
            this.bookingService.appointment$.next(null);
            subscription.unsubscribe();
          },
          error: (error) => {
            confirmButton.disabled = false;
            cancelButton.disabled = true;

            console.error(error);
          }
        });
      },
      reject: () => { }
    });
  }

  cancelReservation(entityId: string, confirmButton: HTMLButtonElement, cancelButton: HTMLButtonElement): void {
    const currentConfirmState = confirmButton.disabled;

    this.confirmationService.confirm({
      message: 'Procedere con la cancellazione?',
      header: 'Conferma cancellazione',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: "none",
      rejectIcon: "none",
      accept: () => {
        confirmButton.disabled = true;
        cancelButton.disabled = true;

        const subscription: Subscription = this.bookingService.deleteUserFromWaitingList(entityId).subscribe({
          next: (response) => {
            this.messageService.add({ severity: 'success', summary: 'Operazione completata', detail: 'Rimosso dalla lista d\'attesa',  life: 1500 });

            this.fetchData(false, true);
          },
          error: (error) => {
            confirmButton.disabled = currentConfirmState;
            cancelButton.disabled = true;

            console.error(error);
          },
          complete: () => subscription.unsubscribe()
        });
      },
      reject: () => { }
    });
  }

  private fetchData(fetchAppointments = true, fetchWaitingList = true): void {
    const subscription: Subscription = this.authService.getActiveAccount()
      .pipe(
        switchMap(account => {
          const observablesToFetch: Observable<any>[] = [];

          if (fetchAppointments) {
            observablesToFetch.push(this.bookingService.getAppointments(account?.homeAccountId!));
          }

          if (fetchWaitingList) {
            observablesToFetch.push(this.bookingService.getUserWaitingList(account?.homeAccountId!));
          }

          return forkJoin(observablesToFetch);
        })
      ).subscribe({
        next: (value) => {
          this.appointments = value[0];
          this.waitingList = value[1];
        },
        error: (error) => console.error(error),
        complete: () => subscription.unsubscribe()
      });
  }
}
