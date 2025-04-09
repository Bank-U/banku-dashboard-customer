export interface AppState {
  auth: AuthState;
  ui: UiState;
}

export interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  token: string | null;
  error: string | null;
  loading: boolean;
}

export interface UiState {
  isDarkMode: boolean;
  language: 'en' | 'es';
  isSidebarExpanded: boolean;
  notifications: AppNotification[];
}

export interface AppNotification {
  id: string;
  message: string;
  type: 'error' | 'success' | 'info' | 'warning';
  timestamp: Date;
  read: boolean;
} 