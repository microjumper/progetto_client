import { Routes } from '@angular/router';

import { HomeComponent } from "./components/home/home.component";
import { BookingComponent } from "./components/booking/booking.component";
import { DropdownComponent } from "./components/steps/dropdown/dropdown.component";
import { CalendarComponent } from "./components/steps/calendar/calendar.component";
import { UploadComponent } from "./components/steps/upload/upload.component";

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'booking', component: BookingComponent,
    children: [
      { path: 'service', component: DropdownComponent },
      { path: 'date', component: CalendarComponent },
      { path: 'upload', component: UploadComponent },
      { path: '', redirectTo: 'service', pathMatch: 'full' }
    ]},
  { path: '**', redirectTo: '' }
];
