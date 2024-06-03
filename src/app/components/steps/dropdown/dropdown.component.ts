import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import { DropdownModule } from "primeng/dropdown";
import { CardModule } from "primeng/card";

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
  }

  private getLegalServices(): void
  {
    this.dataService.getLegalServices().subscribe({
      next: (data: LegalService[]) => {
        this.legalServicesDropdown = data;
      },
      error: (err) => {
        console.error(err.message);
      }
    });
  }

  onLegalServiceSelected(event: { originalEvent: Event, value: any }): void
  {
    this.bookingService.legalServiceId.next(event.value.id);
    this.router.navigate(['booking', 'date']);
  }
}
