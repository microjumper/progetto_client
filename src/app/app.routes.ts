import { Routes } from '@angular/router';

import { HomeComponent } from "./components/home/home.component";
import { BookingComponent } from "./components/booking/booking.component";

export const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'booking', component: BookingComponent},
  { path: '**', redirectTo: '' }
];
