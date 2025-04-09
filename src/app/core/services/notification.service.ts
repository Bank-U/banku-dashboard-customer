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
   * Muestra una notificación toast y la guarda en el estado
   * @param message - Mensaje a mostrar
   * @param type - Tipo de notificación
   * @param persist - Si debe persistir en el historial
   */
  showNotification(
    message: string, 
    type: 'error' | 'success' | 'info' | 'warning' = 'info',
    persist: boolean = true
  ): void {
    // Mostrar snackbar
    this.snackBar.openFromComponent(CustomNotificationComponent, {
      ...this.snackBarConfig,
      data: { message, type }
    });
    
    // Agregar al estado si debe persistir
    if (persist) {
      this.stateService.addNotification({ message, type });
    }
  }

  /**
   * Muestra un mensaje de éxito
   */
  success(message: string, persist: boolean = true): void {
    this.showNotification(message, 'success', persist);
  }

  /**
   * Muestra un mensaje de error
   */
  error(message: string, persist: boolean = true): void {
    this.showNotification(message, 'error', persist);
  }

  /**
   * Muestra un mensaje de advertencia
   */
  warning(message: string, persist: boolean = true): void {
    this.showNotification(message, 'warning', persist);
  }

  /**
   * Muestra un mensaje informativo
   */
  info(message: string, persist: boolean = true): void {
    this.showNotification(message, 'info', persist);
  }

  /**
   * Marca una notificación como leída
   */
  markAsRead(id: string): void {
    this.stateService.markNotificationAsRead(id);
  }

  /**
   * Elimina una notificación
   */
  removeNotification(id: string): void {
    this.stateService.removeNotification(id);
  }

  /**
   * Obtiene todas las notificaciones
   */
  getNotifications(): AppNotification[] {
    return this.stateService.uiState().notifications;
  }

  /**
   * Obtiene las notificaciones no leídas
   */
  getUnreadNotifications(): AppNotification[] {
    return this.getNotifications().filter(n => !n.read);
  }
} 