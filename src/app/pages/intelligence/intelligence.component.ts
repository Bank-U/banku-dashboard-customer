import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { AlertsComponent } from '../../components/alerts/alerts.component';
import { RecommendationsComponent } from '../../components/recommendations/recommendations.component';
import { TranslatePipe } from '../../pipes/translate.pipe';
@Component({
  selector: 'app-intelligence',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    AlertsComponent,
    RecommendationsComponent,
    TranslatePipe
  ],
  template: `
    <div class="intelligence-container">
      <h1 class="title-message-text">Intelligence</h1>
      <mat-tab-group>
        <mat-tab label="{{'common.alerts' | translate | async}}">
          <app-alerts mode="full"></app-alerts>
        </mat-tab>
        <mat-tab label="{{'common.recommendations' | translate | async}}">
          <app-recommendations mode="full"></app-recommendations>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .intelligence-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

  `]
})
export class IntelligenceComponent {
  constructor() {}
} 