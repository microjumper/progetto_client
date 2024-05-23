import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { Observable } from "rxjs";

import { LegalService } from "../../../../progetto_shared/legalService.type";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private httpClient: HttpClient) { }

  getLegalServices(): Observable<LegalService[]>
  {
    return this.httpClient.get<LegalService[]>('http://localhost:7071/api/Getter');
  }
}
