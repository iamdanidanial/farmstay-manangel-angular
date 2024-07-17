import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private apiUrl = `${environment.apiUrl}/activity`; // Ganti dengan URL API Anda

  constructor(private http: HttpClient) { }

    getActivities(): Observable<any[]> {
      return this.http.get<any[]>(this.apiUrl);
    }

  getActivity(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<any>(url);
  }

  addActivity(ActivityData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, ActivityData);
  }

  updateActivity(id: number, ActivityData: FormData): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<any>(url, ActivityData);
  }

  deleteActivity(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
