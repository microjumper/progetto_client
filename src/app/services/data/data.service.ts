import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { Observable } from "rxjs";

import { LegalService } from "../../../../progetto_shared/legalService.type";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private readonly baseUrl: string;
  private readonly getLegalServicesCode: string;

  constructor(private httpClient: HttpClient) {
    if(window.location.hostname === "localhost") {
      this.baseUrl = 'http://localhost:7071/api';
      this.getLegalServicesCode = '';
    }
    else {
      this.baseUrl = 'https://appointment-scheduler.azurewebsites.net/api';
      this.getLegalServicesCode = `?code=${process.env['GET_LEGAL_SERVICES_CODE']}`;
    }
  }

  getLegalServices(): Observable<LegalService[]>
  {
    return this.httpClient.get<LegalService[]>(`${this.baseUrl}/legalservices${this.getLegalServicesCode}`);
  }
}
