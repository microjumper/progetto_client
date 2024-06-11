import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { BehaviorSubject, Observable } from "rxjs";

import { Appointment } from "../../../../progetto_shared/appointment.type";
import { WaitingListEntity } from "../../../../progetto_shared/waitingListEntity.type";

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  appointment$ : BehaviorSubject<Appointment | null>;

  constructor(private httpClient: HttpClient) {
    this.appointment$ = new BehaviorSubject<Appointment | null>(null);
  }

  getDate(): Observable<{ dateISO: string }>
  {
    return this.httpClient.get<{ dateISO: string }>(`http://localhost:7071/api/date`);
  }

  getAppointments(userId: string): Observable<Appointment[]> {
    return this.httpClient.get<Appointment[]>(`http://localhost:7071/api/users/${userId}/appointments`);
  }

  bookAppointment(): Observable<Appointment> {
    return this.httpClient.post<Appointment>('http://localhost:7071/api/appointments/book', this.appointment$.value);
  }

  cancelAppointment(appointmentId: string): Observable<Appointment> {
    return this.httpClient.delete(`http://localhost:7071/api/appointments/cancel/${appointmentId}`);
  }

  subscribeToWaitingList(entity: WaitingListEntity): Observable<WaitingListEntity> {
    return this.httpClient.post<WaitingListEntity>('http://localhost:7071/api/waitinglist/subscribe', entity);
  }
}
