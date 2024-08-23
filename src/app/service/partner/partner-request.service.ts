// partner-request.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PartnerRequest } from '../models/partner-request.model';

@Injectable({
  providedIn: 'root'
})
export class PartnerRequestService {
private apiUrl = 'http://localhost:6000/partner';

  constructor(private http: HttpClient) { }

  // Method to create a new partner request
  createPartnerRequest(request: PartnerRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/requests`, request);
  }

  // Method to fetch all partner requests
  getAllPartnerRequests(): Observable<PartnerRequest[]> {
    return this.http.get<PartnerRequest[]>(`${this.apiUrl}/requests`);
  }
}
