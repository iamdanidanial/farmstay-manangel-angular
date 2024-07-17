import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {
  private apiUrl = `${environment.apiUrlCoba}/countries`; // Ganti dengan URL API Anda

  constructor(private http: HttpClient) { }

    getCountries(): Observable<any[]> {
      return this.http.get<any[]>(this.apiUrl);
    }

    getCountry(id: number): Observable<any> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.get<any>(url);
      }

}
