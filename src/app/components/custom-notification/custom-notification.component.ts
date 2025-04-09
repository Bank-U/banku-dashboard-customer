import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-custom-notification',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <div class="notification-container" [class]="data.type">
      <div class="notification-content">
        <mat-icon class="material-symbols-outlined notification-icon">{{getIcon()}}</mat-icon>
        <span class="notification-message">{{data.message}}</span>
      </div>
      <button mat-icon-button (click)="close()">
        <mat-icon class="material-symbols-outlined">close</mat-icon>
      </button>
    </div>
  `,
  styles: [`
    .notification-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      border-radius: 12px;
      min-width: 400px;
      max-width: 600px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      margin: 16px;
      background-color: white;

      &.error {
        border-left: 4px solid #dc3545;
        .notification-icon {
          color: #dc3545;
        }
      }

      &.success {
        border-left: 4px solid #28a745;
        .notification-icon {
          color: #28a745;
        }
      }

      &.info {
        border-left: 4px solid #1e4d8c;
        .notification-icon {
          color: #1e4d8c;
        }
      }

      &.warning {
        border-left: 4px solid #ffc107;
        .notification-icon {
          color: #ffc107;
        }
      }
    }

    .notification-content {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .notification-icon {
      font-size: 24px;
      height: 24px;
      width: 24px;
    }

    .notification-message {
      font-size: 16px;
      color: #1a1f36;
    }

    button {
      color: #6b7280;
    }
  `]
})
export class CustomNotificationComponent {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: { message: string, type: 'error' | 'success' | 'info' | 'warning' },
    private snackBarRef: MatSnackBarRef<CustomNotificationComponent>
  ) {}

  getIcon(): string {
    switch (this.data.type) {
      case 'error':
        return 'error_outlined';
      case 'success':
        return 'check_circle_outlined';
      case 'warning':
        return 'warning_amber_outlined';
      case 'info':
      default:
        return 'info_outlined';
    }
  }

  close() {
    this.snackBarRef.dismiss();
  }
} 