import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = `${environment.apiUrl}/review`; // Ganti dengan URL API Anda

  constructor(private http: HttpClient) { }

    getReviews(): Observable<any[]> {
      return this.http.get<any[]>(this.apiUrl);
    }

  getReview(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<any>(url);
  }

  addReview(guestData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, guestData);
  }

  updateReview(id: number, guestData: FormData): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<any>(url, guestData);
  }

  deleteReview(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
