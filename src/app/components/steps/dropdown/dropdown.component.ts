import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import { DropdownModule } from "primeng/dropdown";
import { CardModule } from "primeng/card";

import { Subscription } from "rxjs";

import { LegalService } from "../../../../../progetto_shared/legalService.type";
import { DataService } from "../../../services/data/data.service";
import { BookingService } from "../../../services/booking/booking.service";

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [
    DropdownModule,
    CardModule
  ],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss'
})
export class DropdownComponent implements OnInit {

  constructor(private dataService: DataService, private bookingService: BookingService, private router: Router) { }

  legalServicesDropdown: LegalService[] = [];

  ngOnInit(): void {
    this.getLegalServices();

    this.bookingService.appointment$.next(null);
  }

  private getLegalServices(): void
  {
    const subscription: Subscription = this.dataService.getLegalServices().subscribe({
      next: (data: LegalService[]) => this.legalServicesDropdown = data,
      error: (err) => console.error(err.message),
      complete: () => subscription.unsubscribe()
    });
  }

  onLegalServiceSelected(event: { originalEvent: Event, value: any }): void
  {
    this.bookingService.appointment$.next({ legalServiceId: event.value.id, legalServiceTitle: event.value.title });

    this.router.navigate(['booking', 'date']);
  }
}
