import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";

import { DropdownModule } from "primeng/dropdown";
import { CalendarModule } from "primeng/calendar";

import { DataService } from "../../services/data/data.service";
import { LegalService } from "../../types/legalService.type";

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [
    CalendarModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
  ],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss'
})
export class BookingComponent {

  bookingFormGroup: FormGroup;
  legalServicesDropdown: LegalService[] = [];

  constructor(private dataService: DataService) {
    this.bookingFormGroup = new FormGroup({
      legalService: new FormControl(null)
    });

    this.getLegalServices();
  }

  onDateSelect(date: any) {
    console.log(date);
  }

  getLegalServices(): void
  {
    this.dataService.getLegalServices().subscribe({
      next: (data: LegalService[]) => {
        this.legalServicesDropdown = data;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  onLegalServiceSelected(event: { originalEvent: Event, value: any }): void
  {
    console.log(event.value)
  }
}
