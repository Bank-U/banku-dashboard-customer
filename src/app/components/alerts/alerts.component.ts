import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Alert } from '../../services/intelligence.service';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent {
  @Input() alerts: Alert[] = [];
  @Output() resolve = new EventEmitter<string>();
  @Output() viewAll = new EventEmitter<void>();

  getAlertIcon(type: string): string {
    switch (type) {
      case 'CRITICAL':
        return 'error_outlined';
      case 'WARNING':
        return 'warning_amber_outlined';
      case 'INFO':
      default:
        return 'info_outlined';
    }
  }

  onResolve(alertId: string) {
    this.resolve.emit(alertId);
  }

  onViewAll() {
    this.viewAll.emit();
  }
} 