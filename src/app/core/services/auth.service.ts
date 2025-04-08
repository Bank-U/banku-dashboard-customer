import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { LoginRequest } from '../models/auth/login-request';
import { RegisterRequest } from '../models/auth/register-request';
import { AuthResponse } from '../models/auth/auth-response';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private tokenKey = 'auth_token';
  private userIdKey = 'user_id';

  constructor(private http: HttpClient) { }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request)
      .pipe(
        tap(response => this.saveAuthData(response)),
        catchError(error => {
          console.error('Login error:', error);
          return throwError(() => new Error('Error de autenticación. Por favor, verifica tus credenciales.'));
        })
      );
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, request)
      .pipe(
        tap(response => this.saveAuthData(response)),
        catchError(error => {
          console.error('Register error:', error);
          return throwError(() => new Error('Error al registrar. Por favor, intenta de nuevo.'));
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userIdKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUserId(): string | null {
    return localStorage.getItem(this.userIdKey);
  }

  private saveAuthData(response: AuthResponse): void {
    localStorage.setItem(this.tokenKey, response.token);
    localStorage.setItem(this.userIdKey, response.userId);
  }
} 