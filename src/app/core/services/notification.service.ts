import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StateService } from './state.service';
import { AppNotification } from '../models/app-state.model';
import { CustomNotificationComponent } from '../../components/custom-notification/custom-notification.component';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private snackBarConfig = {
    duration: 5000,
    horizontalPosition: 'center' as const,
    verticalPosition: 'top' as const,
    panelClass: ['custom-notification']
  };

  constructor(
    private snackBar: MatSnackBar,
    private stateService: StateService
  ) {}

  /**
   * Shows a toast notification and saves it in the state
   * @param message - Message to display
   * @param type - Notification type
   * @param persist - Whether it should persist in history
   */
  showNotification(
    message: string, 
    type: 'error' | 'success' | 'info' | 'warning' = 'info',
    persist: boolean = true
  ): void {
    // Show snackbar
    this.snackBar.openFromComponent(CustomNotificationComponent, {
      ...this.snackBarConfig,
      data: { message, type }
    });
    
    // Add to state if it should persist
    if (persist) {
      this.stateService.addNotification({ message, type });
    }
  }

  /**
   * Shows a success message
   */
  success(message: string, persist: boolean = true): void {
    this.showNotification(message, 'success', persist);
  }

  /**
   * Shows an error message
   */
  error(message: string, persist: boolean = true): void {
    this.showNotification(message, 'error', persist);
  }

  /**
   * Shows a warning message
   */
  warning(message: string, persist: boolean = true): void {
    this.showNotification(message, 'warning', persist);
  }

  /**
   * Shows an informational message
   */
  info(message: string, persist: boolean = true): void {
    this.showNotification(message, 'info', persist);
  }

  /**
   * Marks a notification as read
   */
  markAsRead(id: string): void {
    this.stateService.markNotificationAsRead(id);
  }

  /**
   * Removes a notification
   */
  removeNotification(id: string): void {
    this.stateService.removeNotification(id);
  }

  /**
   * Gets all notifications
   */
  getNotifications(): AppNotification[] {
    return this.stateService.uiState().notifications;
  }

  /**
   * Gets unread notifications
   */
  getUnreadNotifications(): AppNotification[] {
    return this.getNotifications().filter(n => !n.read);
  }
} 