import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  get<T>(endpoint: string, headers?: HttpHeaders): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}${endpoint}`, { headers });
  }

  post<T>(endpoint: string, data: any, headers?: HttpHeaders): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}${endpoint}`, data, { headers });
  }

  put<T>(endpoint: string, data: any, headers?: HttpHeaders): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}${endpoint}`, data, { headers });
  }

  delete<T>(endpoint: string, headers?: HttpHeaders): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}${endpoint}`, { headers });
  }
} 