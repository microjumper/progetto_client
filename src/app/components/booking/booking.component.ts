import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';

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

  constructor(private bookingService: BookingService, private changeDetector: ChangeDetectorRef) {
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
    this.subscriptions.push(
      this.bookingService.appointment$.subscribe({
        next: appointment => {
          if(appointment) {
            this.breadcrumbs = [this.breadcrumbs[0]];
            this.breadcrumbs.push({ label: appointment.legalServiceTitle });
            if(appointment.eventDate) {
              const localizedDate = new Date(appointment.eventDate).toLocaleString('it-IT', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });
              this.breadcrumbs.push({ label: localizedDate });
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
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
