// src/app/dashboard.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = `${environment.apiUrlCoba}/count`; // Ganti dengan URL API Anda

  constructor(private http: HttpClient) { }

    getCounts(): Observable<any[]> {
      return this.http.get<any[]>(this.apiUrl);
    }
}
