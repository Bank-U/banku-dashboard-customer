import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppState, AuthState, UiState, AppNotification } from '../models/app-state.model';

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
      language: 'en',
      isSidebarExpanded: true,
      notifications: []
    }
  };

  // BehaviorSubject for the complete state
  private state = new BehaviorSubject<AppState>(this.initialState);
  
  // Signals for reactive components
  public authState = signal<AuthState>(this.initialState.auth);
  public uiState = signal<UiState>(this.initialState.ui);

  constructor() {
    // Retrieve state from localStorage if it exists
    this.loadStateFromStorage();
    
    // Subscribe to state changes to persist them and update signals
    this.state.subscribe(state => {
      this.persistState(state);
      this.authState.set(state.auth);
      this.uiState.set(state.ui);
    });
  }

  // Getters for specific parts of the state
  getState(): Observable<AppState> {
    return this.state.asObservable();
  }

  // Update authentication state
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

  // Update UI state
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

  // Add a notification
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

  // Mark a notification as read
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

  // Remove a notification
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

  // Persist state in localStorage
  private persistState(state: AppState): void {
    localStorage.setItem('app_state', JSON.stringify(state));
  }

  // Load state from localStorage
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

  // Reset state
  resetState(): void {
    localStorage.removeItem('app_state');
    this.state.next(this.initialState);
  }
} 