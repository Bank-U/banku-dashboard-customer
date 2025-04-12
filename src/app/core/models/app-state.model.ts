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

export type Language = 'en' | 'es';

export interface UiState {
  isDarkMode: boolean;
  language: Language;
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