import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GuestService {
  private apiUrl = `${environment.apiUrlCoba}/guest`; // Ganti dengan URL API Anda

  constructor(private http: HttpClient) { }

    getGuests(): Observable<any[]> {
      return this.http.get<any[]>(this.apiUrl);
    }

  getGuest(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<any>(url);
  }

  addGuest(guestData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, guestData);
  }

  updateGuest(id: number, guestData: FormData): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<any>(url, guestData);
  }

  deleteGuest(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
