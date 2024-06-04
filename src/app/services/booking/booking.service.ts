import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { BehaviorSubject, Observable } from "rxjs";

import { EventApi } from "@fullcalendar/core";
import { Appointment } from "../../../../progetto_shared/appointment.type";

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  appointment$ = new BehaviorSubject<Appointment | null>(null);

  constructor(private httpClient: HttpClient) { }

  getEventsByLegalService(legalServiceId: string): Observable<EventApi[]> {
    return this.httpClient.get<EventApi[]>(`http://localhost:7071/api/events/legal-service/${legalServiceId}`);
  }

  bookAppointment(event: EventApi): Observable<any> {
    return this.httpClient.post(`XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`, event);
  }

  cancelAppointment(event: EventApi): Observable<any> {
    return this.httpClient.delete(`XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`);
  }
}
