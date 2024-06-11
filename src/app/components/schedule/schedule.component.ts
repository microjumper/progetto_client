import { Component, OnDestroy, OnInit } from '@angular/core';
import { DatePipe, NgForOf } from "@angular/common";
import { RouterLink } from "@angular/router";

import { ButtonDirective } from "primeng/button";
import { FieldsetModule } from "primeng/fieldset";
import { ConfirmationService, MessageService } from "primeng/api";

import { Subscription, switchMap } from "rxjs";

import { Appointment } from "../../../../progetto_shared/appointment.type";
import { BookingService } from "../../services/booking/booking.service";
import { AuthService } from "../../services/auth/auth.service";

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

  constructor(private bookingService: BookingService, private confirmationService: ConfirmationService, private messageService: MessageService, private authService: AuthService) { }

  ngOnInit(): void {
    this.fetchAppointments();
  }

  cancelAppointment(appointmentID: string) {
    this.confirmationService.confirm({
      message: 'Procedere con la cancellazione dell\'appuntamento?',
      header: 'Conferma cancellazione',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: "none",
      rejectIcon: "none",
      accept: () => {
        const subscription: Subscription = this.bookingService.cancelAppointment(appointmentID).subscribe({
          next: (response) => {
            this.fetchAppointments();

            this.messageService.add({ severity: 'success', summary: 'Operazione completata', detail: 'Appuntamento cancellato con successo',  life: 1500 });
          },
          error: (error) => console.error(error),
          complete: () => subscription.unsubscribe()
        });
      },
      reject: () => { }
    });
  }

  private fetchAppointments(): void {
    const subscription: Subscription = this.authService.getActiveAccount().pipe(
      switchMap(account => this.bookingService.getAppointments(account?.homeAccountId!))
    ).subscribe({
      next: (response) => this.appointments = response,
      error: (error) => console.error(error),
      complete: () => subscription.unsubscribe()
    });
  }
}
