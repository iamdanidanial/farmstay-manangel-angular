import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FacilityService {
  private apiUrl = `${environment.apiUrl}/facility`; // Ganti dengan URL API Anda

  constructor(private http: HttpClient) { }

    getFacilities(): Observable<any[]> {
      return this.http.get<any[]>(this.apiUrl);
    }

  getFacility(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<any>(url);
  }

  addFacility(guestData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, guestData);
  }

  updateFacility(id: number, guestData: FormData): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<any>(url, guestData);
  }

  deleteFacility(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
