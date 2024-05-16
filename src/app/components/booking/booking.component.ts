import { Component } from '@angular/core';

import { CalendarModule } from "primeng/calendar";

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [
    CalendarModule,
  ],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss'
})
export class BookingComponent {

  onDateSelect(date: any) {
    console.log(date);
  }
}
