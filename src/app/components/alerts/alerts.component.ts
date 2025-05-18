import { Component, Input } from '@angular/core';
import { Alert, IntelligenceService } from '../../services/intelligence.service';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    TranslatePipe,
    FormsModule,
    RouterLink
  ]
})
export class AlertsComponent {
  @Input() mode: 'light' | 'full' = 'full';
  @Input() alerts: Alert[] = [];
  showResolved = false;
  
  constructor(
    private readonly intelligenceService: IntelligenceService,
  ) {}

  get filteredAlerts(): Alert[] {
    return this.alerts.filter(alert => this.showResolved || !alert.resolved);
  }

  onResolve(alertId: string) {
    if (this.mode === 'light') return;
    
    this.intelligenceService.resolveAlert(alertId).subscribe({
      next: () => {
        const alert = this.alerts.find(alert => alert.id === alertId);
        if (alert) {
          alert.resolved = true;
        }
      },
      error: (error) => {
        console.error('Error resolving alert:', error);
      }
    });
  }

  getAlertIcon(type: string): string {
    switch (type.toLowerCase()) {
      case 'critical':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'notifications';
    }
  }
} 