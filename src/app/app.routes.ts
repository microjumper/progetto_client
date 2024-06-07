import { Routes } from '@angular/router';

import { MsalGuard } from "@azure/msal-angular";

import { HomeComponent } from "./components/home/home.component";
import { BookingComponent } from "./components/booking/booking.component";
import { DropdownComponent } from "./components/steps/dropdown/dropdown.component";
import { CalendarComponent } from "./components/steps/calendar/calendar.component";
import { UploadComponent } from "./components/steps/upload/upload.component";
import { ScheduleComponent } from "./components/schedule/schedule/schedule.component";

import { dateGuard } from "./guards/steps/date/date.guard";
import { uploadGuard } from "./guards/steps/upload/upload.guard";

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'booking', component: BookingComponent, canActivate: [MsalGuard],
    children: [
      { path: 'service', component: DropdownComponent },
      { path: 'date', component: CalendarComponent, canActivate: [dateGuard]},
      { path: 'upload', component: UploadComponent, canActivate: [uploadGuard]},
      { path: '**', redirectTo: 'service' }
    ]
  },
  { path: 'schedule', component: ScheduleComponent, canActivate: [MsalGuard] },
  { path: '**', redirectTo: '' }
];
