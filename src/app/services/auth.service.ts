import { Injectable } from '@angular/core';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { LoginRequest } from '../core/models/auth/login-request';
import { RegisterRequest } from '../core/models/auth/register-request';
import { AuthResponse } from '../core/models/auth/auth-response';
import { ApiService } from './api.service';
import { StateService } from '../core/services/state.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private apiService: ApiService,
    private stateService: StateService
  ) {
    // Initialize authentication state when service starts
    this.initAuthState();
  }

  /**
   * Initializes the authentication state based on the stored token
   */
  private initAuthState(): void {
    const token = localStorage.getItem('auth_token');
    const userId = localStorage.getItem('user_id');
    
    if (token && userId) {
      this.stateService.updateAuthState({
        isAuthenticated: true,
        token,
        userId
      });
    }
  }

  /**
   * Authenticates user with credentials
   */
  login(request: LoginRequest): Observable<AuthResponse> {
    this.stateService.updateAuthState({ loading: true, error: null });
    
    return this.apiService.post<AuthResponse>(`/v1/auth/login`, request)
      .pipe(
        tap(response => {
          this.saveAuthData(response);
          this.stateService.updateAuthState({ 
            isAuthenticated: true, 
            userId: response.userId, 
            token: response.token,
            loading: false,
            error: null
          });
        }),
        catchError(error => {
          this.stateService.updateAuthState({ 
            loading: false, 
            error: error.error?.message || 'Authentication error. Please verify your credentials.' 
          });
          
          return throwError(() => error);
        })
      );
  }

  /**
   * Registers a new user
   */
  register(request: RegisterRequest): Observable<AuthResponse> {
    this.stateService.updateAuthState({ loading: true, error: null });
    
    return this.apiService.post<AuthResponse>(`/v1/auth/register`, request)
      .pipe(
        tap(response => {
          this.saveAuthData(response);
          this.stateService.updateAuthState({ 
            isAuthenticated: true, 
            userId: response.userId, 
            token: response.token,
            loading: false,
            error: null
          });
        }),
        catchError(error => {
          this.stateService.updateAuthState({ 
            loading: false, 
            error: error.error?.message || 'Registration error. Please try again.' 
          });
          
          return throwError(() => error);
        })
      );
  }

  /**
   * Logs out the user
   */
  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_id');
    
    this.stateService.updateAuthState({
      isAuthenticated: false,
      userId: null,
      token: null
    });
  }

  /**
   * Checks if the user is authenticated
   */
  isAuthenticated(): boolean {
    return this.stateService.authState().isAuthenticated;
  }

  /**
   * Gets the authentication token
   */
  getToken(): string | null {
    return this.stateService.authState().token;
  }

  /**
   * Gets the user ID
   */
  getUserId(): string | null {
    return this.stateService.authState().userId;
  }

  /**
   * Saves authentication information
   */
  private saveAuthData(response: AuthResponse): void {
    localStorage.setItem('auth_token', response.token);
    localStorage.setItem('user_id', response.userId);
  }
} 