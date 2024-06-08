import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { BehaviorSubject, Observable } from "rxjs";

import { Appointment } from "../../../../progetto_shared/appointment.type";

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  appointment$ : BehaviorSubject<Appointment | null>;

  constructor(private httpClient: HttpClient) {
    this.appointment$ = new BehaviorSubject<Appointment | null>(null);
  }

  getAppointments(): Observable<Appointment[]> {
    return this.httpClient.get<Appointment[]>('http://localhost:7071/api/appointments');
  }

  bookAppointment(): Observable<Appointment> {
    return this.httpClient.post<Appointment>('http://localhost:7071/api/appointments/book', this.appointment$.value);
  }

  cancelAppointment(appointmentId: string): Observable<any> {
    return this.httpClient.delete(`http://localhost:7071/api/appointments/cancel/${appointmentId}`);
  }
}
