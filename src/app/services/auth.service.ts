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
    // Inicializar el estado de autenticación al iniciar el servicio
    this.initAuthState();
  }

  /**
   * Inicializa el estado de autenticación basado en el token almacenado
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
   * Autentica al usuario con credenciales
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
            error: error.error?.message || 'Error de autenticación. Por favor, verifica tus credenciales.' 
          });
          
          return throwError(() => error);
        })
      );
  }

  /**
   * Registra un nuevo usuario
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
            error: error.error?.message || 'Error al registrar. Por favor, intenta de nuevo.' 
          });
          
          return throwError(() => error);
        })
      );
  }

  /**
   * Cierra la sesión del usuario
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
   * Verifica si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return this.stateService.authState().isAuthenticated;
  }

  /**
   * Obtiene el token de autenticación
   */
  getToken(): string | null {
    return this.stateService.authState().token;
  }

  /**
   * Obtiene el ID del usuario
   */
  getUserId(): string | null {
    return this.stateService.authState().userId;
  }

  /**
   * Guarda la información de autenticación
   */
  private saveAuthData(response: AuthResponse): void {
    localStorage.setItem('auth_token', response.token);
    localStorage.setItem('user_id', response.userId);
  }
} 