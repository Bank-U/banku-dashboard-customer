import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { AlertsComponent } from '../../components/alerts/alerts.component';
import { RecommendationsComponent } from '../../components/recommendations/recommendations.component';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { IntelligenceService, Alert, Recommendation } from '../../services/intelligence.service';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-intelligence',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    AlertsComponent,
    RecommendationsComponent,
    TranslatePipe,
    MatIconModule,
    MatBadgeModule
  ],
  template: `
    <div class="intelligence-container">
      <h1 class="title-message-text">{{ 'intelligence.title' | translate | async }}</h1>
      
      <div class="expansion-panels">
        <!-- Alerts Panel -->
        <mat-expansion-panel class="intelligence-panel">
          <mat-expansion-panel-header>
            <mat-panel-title>
              <div class="panel-header">
                <mat-icon class="material-symbols-outlined panel-icon">notifications</mat-icon>
                <span>{{ 'common.alerts' | translate | async }}</span>
                <div class="panel-stats">
                  <span class="total">{{ alerts.length }}</span>
                  <span class="resolved">({{ countResolvedAlerts() }})</span>
                </div>
              </div>
            </mat-panel-title>
          </mat-expansion-panel-header>
          <app-alerts mode="full" [alerts]="alerts"></app-alerts>
        </mat-expansion-panel>

        <!-- Recommendations Panel -->
        <mat-expansion-panel class="intelligence-panel">
          <mat-expansion-panel-header>
            <mat-panel-title>
              <div class="panel-header">
                <mat-icon class="material-symbols-outlined panel-icon">lightbulb</mat-icon>
                <span>{{ 'common.recommendations' | translate | async }}</span>
                <div class="panel-stats">
                  <span class="total">{{ recommendations.length }}</span>
                  <span class="resolved">({{ countResolvedRecommendations() }})</span>
                </div>
              </div>
            </mat-panel-title>
          </mat-expansion-panel-header>
          <app-recommendations mode="full" [recommendations]="recommendations"></app-recommendations>
        </mat-expansion-panel>
      </div>
    </div>
  `,
  styles: [`
    .intelligence-container {
      max-width: 1200px;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .expansion-panels {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .intelligence-panel {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05) !important;

      ::ng-deep .mat-expansion-panel-header {
        padding: 16px 24px;
        height: auto !important;
      }

      ::ng-deep .mat-expansion-panel-body {
        padding: 0px;
      }
    }

    .panel-header {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
    }

    .panel-icon {
      color: var(--banku-call-to-action);
      font-size: 24px;
      height: 24px;
      width: 24px;
    }

    .panel-stats {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 14px;

      .total {
        color: var(--banku-call-to-action);
        font-weight: 500;
      }

      .resolved {
        color: #64748b;
      }
    }
  `]
})
export class IntelligenceComponent implements OnInit {
  alerts: Alert[] = [];
  recommendations: Recommendation[] = [];

  constructor(private readonly intelligenceService: IntelligenceService) {}

  ngOnInit() {
    this.loadIntelligenceData();
  }

  private loadIntelligenceData() {
    this.intelligenceService.getIntelligenceData().subscribe({
      next: (data) => {
        this.alerts = data.alerts;
        this.recommendations = data.recommendations;
      },
      error: (error) => {
        console.error('Error loading intelligence data:', error);
      }
    });
  }

  countResolvedAlerts(): number {
    return this.alerts.filter(alert => alert.resolved).length;
  }

  countResolvedRecommendations(): number {
    return this.recommendations.filter(rec => rec.resolved).length;
  }
} 