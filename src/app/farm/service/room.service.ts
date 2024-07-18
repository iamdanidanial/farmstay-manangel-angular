import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private apiUrl = `${environment.apiUrlCoba}/room`; // Ganti dengan URL API Anda

  constructor(private http: HttpClient) { }

  getRooms(): Observable<any[]> {
      return this.http.get<any[]>(this.apiUrl);
  }

  getRoom(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<any>(url);
  }

  addRoom(guestData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, guestData);
  }

  updateRoom(id: number, guestData: FormData): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<any>(url, guestData);
  }

  deleteRoom(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
