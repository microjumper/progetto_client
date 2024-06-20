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

  private readonly baseUrl: string;
  private readonly getCurrentDateCode: string;
  private readonly getAppointmentsCode: string;
  private readonly bookCode: string;
  private readonly cancelCode: string;
  private readonly addToWaitingListCode: string;
  private readonly getUserWaitingListCode: string;
  private readonly deleteUserFromWaitingListCode: string;

  constructor(private httpClient: HttpClient) {
    this.appointment$ = new BehaviorSubject<Appointment | null>(null);

    if (window.location.hostname === "localhost") {
      this.baseUrl = 'http://localhost:7071/api';
      this.getCurrentDateCode = '';
      this.getAppointmentsCode = '';
      this.bookCode = '';
      this.cancelCode = '';
      this.addToWaitingListCode = '';
      this.getUserWaitingListCode = '';
      this.deleteUserFromWaitingListCode = '';
    }
    else {
      this.baseUrl = 'https://appointment-scheduler.azurewebsites.net/api';
      this.getCurrentDateCode = `?code=${process.env['GET_CURRENT_DATE_CODE']}`;
      this.getAppointmentsCode = `?code=${process.env['GET_APPOINTMENTS_CODE']}`;
      this.bookCode = `?code=${process.env['BOOK_CODE']}`;
      this.cancelCode = `?code=${process.env['CANCEL_CODE']}`;
      this.addToWaitingListCode = `?code=${process.env['ADD_TO_WAITING_LIST_CODE']}`;
      this.getUserWaitingListCode = `?code=${process.env['GET_USER_WAITING_LIST_CODE']}`;
      this.deleteUserFromWaitingListCode = `?code=${process.env['DELETE_USER_FROM_WAITING_LIST_CODE']}`;
    }
  }

  getDate(): Observable<{ dateISO: string }>
  {
    return this.httpClient.get<{ dateISO: string }>(`${this.baseUrl}/date${this.getCurrentDateCode}`);
  }

  getAppointments(userId: string): Observable<Appointment[]> {
    return this.httpClient.get<Appointment[]>(`${this.baseUrl}/users/${userId}/appointments${this.getAppointmentsCode}`);
  }

  bookAppointment(): Observable<Appointment> {
    return this.httpClient.post<Appointment>(`${this.baseUrl}/appointments/book${this.bookCode}`, this.appointment$.value);
  }

  cancelAppointment(appointmentId: string): Observable<Appointment> {
    return this.httpClient.delete(`${this.baseUrl}/appointments/cancel/${appointmentId}${this.cancelCode}`);
  }

  addToWaitingList(): Observable<WaitingListEntity> {
    return this.httpClient.post<WaitingListEntity>(`${this.baseUrl}/waitinglist/add${this.addToWaitingListCode}`, this.appointment$.value);
  }

  getUserWaitingList(userId: string): Observable<WaitingListEntity[]> {
    return this.httpClient.get<WaitingListEntity[]>(`${this.baseUrl}/users/${userId}/waitinglist${this.getUserWaitingListCode}`);
  }

  deleteUserFromWaitingList(entityId: string): Observable<WaitingListEntity> {
    return this.httpClient.delete<WaitingListEntity>(`${this.baseUrl}/waitinglist/remove/${entityId}${this.deleteUserFromWaitingListCode}`)
  }
}
