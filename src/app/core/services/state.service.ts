import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppState, AuthState, UiState, AppNotification } from '../models/app-state.model';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  // Estado inicial
  private initialState: AppState = {
    auth: {
      isAuthenticated: false,
      userId: null,
      token: null,
      error: null,
      loading: false
    },
    ui: {
      isDarkMode: false,
      language: 'en',
      isSidebarExpanded: true,
      notifications: []
    }
  };

  // BehaviorSubject para el estado completo
  private state = new BehaviorSubject<AppState>(this.initialState);
  
  // Signals para componentes reactivos
  public authState = signal<AuthState>(this.initialState.auth);
  public uiState = signal<UiState>(this.initialState.ui);

  constructor() {
    // Recuperar estado del localStorage si existe
    this.loadStateFromStorage();
    
    // Suscribirse a cambios de estado para persistirlos y actualizar las signals
    this.state.subscribe(state => {
      this.persistState(state);
      this.authState.set(state.auth);
      this.uiState.set(state.ui);
    });
  }

  // Getters para partes específicas del estado
  getState(): Observable<AppState> {
    return this.state.asObservable();
  }

  // Actualizar el estado de autenticación
  updateAuthState(authState: Partial<AuthState>): void {
    const currentState = this.state.getValue();
    this.state.next({
      ...currentState,
      auth: {
        ...currentState.auth,
        ...authState
      }
    });
  }

  // Actualizar el estado de la UI
  updateUiState(uiState: Partial<UiState>): void {
    const currentState = this.state.getValue();
    this.state.next({
      ...currentState,
      ui: {
        ...currentState.ui,
        ...uiState
      }
    });
  }

  // Agregar una notificación
  addNotification(notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>): void {
    const currentState = this.state.getValue();
    const newNotification: AppNotification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };
    
    this.state.next({
      ...currentState,
      ui: {
        ...currentState.ui,
        notifications: [newNotification, ...currentState.ui.notifications]
      }
    });
  }

  // Marcar una notificación como leída
  markNotificationAsRead(id: string): void {
    const currentState = this.state.getValue();
    const updatedNotifications = currentState.ui.notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    );
    
    this.state.next({
      ...currentState,
      ui: {
        ...currentState.ui,
        notifications: updatedNotifications
      }
    });
  }

  // Eliminar una notificación
  removeNotification(id: string): void {
    const currentState = this.state.getValue();
    const updatedNotifications = currentState.ui.notifications.filter(
      notification => notification.id !== id
    );
    
    this.state.next({
      ...currentState,
      ui: {
        ...currentState.ui,
        notifications: updatedNotifications
      }
    });
  }

  // Persistir estado en localStorage
  private persistState(state: AppState): void {
    localStorage.setItem('app_state', JSON.stringify(state));
  }

  // Cargar estado desde localStorage
  private loadStateFromStorage(): void {
    const savedState = localStorage.getItem('app_state');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        this.state.next({
          ...this.initialState,
          ...parsedState
        });
      } catch (e) {
        console.error('Error parsing saved state', e);
      }
    }
  }

  // Resetear el estado
  resetState(): void {
    localStorage.removeItem('app_state');
    this.state.next(this.initialState);
  }
} 