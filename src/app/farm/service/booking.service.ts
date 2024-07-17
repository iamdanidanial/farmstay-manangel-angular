import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = `${environment.apiUrl}/booking`; // Ganti dengan URL API Anda

  constructor(private http: HttpClient) { }

    getBookings(): Observable<any[]> {
      return this.http.get<any[]>(this.apiUrl);
    }

  getBooking(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<any>(url);
  }

  addBooking(guestData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, guestData);
  }

  updateBooking(id: number, guestData: FormData): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<any>(url, guestData);
  }

  deleteBooking(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
