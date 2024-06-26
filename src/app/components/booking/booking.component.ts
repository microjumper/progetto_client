import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

import { StepsModule } from "primeng/steps";
import { MenuItem } from "primeng/api";
import { CardModule } from "primeng/card";
import { BreadcrumbModule } from "primeng/breadcrumb";

import { Subscription } from "rxjs";

import { BookingService } from "../../services/booking/booking.service";

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [
    StepsModule,
    CardModule,
    BreadcrumbModule,
  ],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss'
})
export class BookingComponent implements OnInit, OnDestroy {

  steps: MenuItem[];
  breadcrumbs: MenuItem[];
  subscriptions: Subscription[] = [];

  constructor(private bookingService: BookingService, private changeDetector: ChangeDetectorRef, private datePipe: DatePipe) {
    this.steps = [
      {
        label: 'Seleziona un servizio',
        routerLink: 'service'
      },
      {
        label: 'Seleziona un appuntamento',
        routerLink: 'date'
      },
      {
        label: 'Allega dei documenti (opzionale)',
        routerLink: 'upload'
      }
    ];

    this.breadcrumbs = [];
  }

  ngOnInit(): void {
    this.setBreadcrumbs();
  }

  private setBreadcrumbs(): void {
    const appointmentSubscription = this.bookingService.appointment$.subscribe({
      next: appointment => {
        if(appointment) {
          this.breadcrumbs = [this.breadcrumbs[0]];
          this.breadcrumbs.push({ label: appointment.legalServiceTitle });
          if(appointment.eventDate) {
            const localizedDate = this.datePipe.transform(appointment.eventDate, 'EEEE d MMMM y HH:mm', 'it-IT');
            this.breadcrumbs.push({ label: localizedDate?.toString() });
            this.breadcrumbs.push({ label: '' });
          }
          else {
            this.breadcrumbs.push({ label: '' });
          }
        }
        else {
          this.breadcrumbs = [
            { icon: 'pi pi-calendar' },
            { label: '' }
          ];
        }
        this.changeDetector.detectChanges();
      },
      error: error => console.error(error.message)
    });

    this.subscriptions.push(appointmentSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
