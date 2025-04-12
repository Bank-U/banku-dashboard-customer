import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { AppState, AuthState, UiState, AppNotification, Language } from '../models/app-state.model';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  // Initial state
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
      language: navigator.language.split('-')[0] as Language || 'en',
      isSidebarExpanded: true,
      notifications: []
    }
  };

  private state = new BehaviorSubject<AppState>(this.initialState);
  
  public authState = signal<AuthState>(this.initialState.auth);
  public uiState = signal<UiState>(this.initialState.ui);

  constructor() {
    this.loadStateFromStorage();
    
    this.state.subscribe(state => {
      this.persistState(state);
      this.authState.set(state.auth);
      this.uiState.set(state.ui);
    });
  }

  getState(): Observable<AppState> {
    return this.state.asObservable();
  }

  getLanguage(): Observable<Language> {
    return this.state.pipe(
      map(state => state.ui.language)
    );
  }

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

  private persistState(state: AppState): void {
    localStorage.setItem('app_state', JSON.stringify(state));
  }

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

  resetState(): void {
    localStorage.removeItem('app_state');
    this.state.next(this.initialState);
  }
} 