import { Injectable } from '@angular/core';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { LoginRequest } from '../core/models/auth/login-request';
import { RegisterRequest } from '../core/models/auth/register-request';
import { AuthResponse } from '../core/models/auth/auth-response';
import { ApiService } from './api.service';
import { StateService } from '../core/services/state.service';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private readonly apiService: ApiService,
    private readonly stateService: StateService
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
            error: error.error?.message ?? 'Authentication error. Please verify your credentials.' 
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
            error: error.error?.message ?? 'Registration error. Please try again.' 
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

  /**
   * Deletes the user's account
   */
  deleteAccount(): Observable<void> {
    const userId = this.getUserId();
    if (!userId) {
      return throwError(() => new Error('User not authenticated'));
    }

    return this.apiService.delete<void>(`/v1/users/${userId}`)
      .pipe(
        tap(() => {
          this.logout();
        }),
        catchError(error => {
          this.stateService.updateAuthState({ 
            error: error.error?.message ?? 'Error deleting account. Please try again.' 
          });
          return throwError(() => error);
        })
      );
  }

  /**
   * Refreshes the authentication token
   */
  refreshToken(): Observable<AuthResponse> {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      return throwError(() => new Error('No token available'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.apiService.post<AuthResponse>(`/v1/auth/refresh`, null, headers)
      .pipe(
        tap(response => {
          this.saveAuthData(response);
          this.stateService.updateAuthState({
            isAuthenticated: true,
            userId: response.userId,
            token: response.token
          });
        }),
        catchError(error => {
          this.logout();
          return throwError(() => error);
        })
      );
  }

  /**
   * Checks if the token is expired
   */
  isTokenExpired(): boolean {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      return true;
    }

    const tokenData = JSON.parse(atob(token.split('.')[1]));
    const expirationDate = new Date(tokenData.exp * 1000);
    return expirationDate < new Date();
  }

  /**
   * Logs in with Google OAuth
   */
  loginWithGoogle(): void {
    const clientId = '441073112820-p5s6l898b5v91bouvltbccbu7cf147lk.apps.googleusercontent.com';
    const redirectUri = encodeURIComponent(`${environment.apiUrl}/v1/auth/oauth2/callback/google`);
    const scope = encodeURIComponent('email profile');
    const responseType = 'code';
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;
    window.location.href = authUrl;
  }

  /**
   * Handles OAuth callback
   */
  handleOAuthCallback(token: string): void {
    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const userId = tokenPayload.userId;
      
      this.saveAuthData({ token, userId });
      this.stateService.updateAuthState({
        isAuthenticated: true,
        userId,
        token,
        loading: false,
        error: null
      });
    } catch (error) {
      this.stateService.updateAuthState({
        loading: false,
        error: 'Invalid token received'
      });
    }
  }
} 