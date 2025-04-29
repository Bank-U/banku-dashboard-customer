import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Alert, IntelligenceData, IntelligenceService } from '../../services/intelligence.service';
import { TranslateService } from '../../core/services/translate.service';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatSlideToggleModule,
    MatIconModule,
    MatButtonModule,
    TranslatePipe,
    FormsModule
  ]
})
export class AlertsComponent implements OnInit {
  @Input() mode: 'light' | 'full' = 'full';
  alerts: Alert[] = [];
  showResolved = false;

  constructor(
    private intelligenceService: IntelligenceService,
    private router: Router,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.loadAlerts();
  }

  get filteredAlerts(): Alert[] {
    return this.alerts.filter(alert => this.showResolved || !alert.resolved);
  }

  private loadAlerts() {
    this.intelligenceService.getIntelligenceData().subscribe({
      next: (intelligenceData: IntelligenceData) => {
        this.alerts = intelligenceData.alerts;
      },
      error: (error) => {
        console.error('Error loading alerts:', error);
      }
    });
  }

  onResolve(alertId: string) {
    if (this.mode === 'light') return;
    
    this.intelligenceService.resolveAlert(alertId).subscribe({
      next: () => {
        this.loadAlerts();
      },
      error: (error) => {
        console.error('Error resolving alert:', error);
      }
    });
  }

  onViewAll() {
    this.router.navigate(['/intelligence']);
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