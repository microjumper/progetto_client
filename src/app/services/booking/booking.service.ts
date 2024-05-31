import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { Observable } from "rxjs";

import { EventApi } from "@fullcalendar/core";

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(private httpClient: HttpClient) { }

  getEventsByLegalService(legalServiceId: string): Observable<EventApi[]> {
    return this.httpClient.get<EventApi[]>(`http://localhost:7071/api/events/legal-service/${legalServiceId}`);
  }
}
