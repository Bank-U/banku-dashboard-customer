import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { PlaidService } from '../../services/plaid.service';
import { IntelligenceService, Alert, Recommendation, IntelligenceData } from '../../services/intelligence.service';
import { Subscription } from 'rxjs';
import { CustomNotificationComponent } from '../../components/custom-notification/custom-notification.component';
import { AlertsComponent } from '../../components/alerts/alerts.component';
import { RecommendationsComponent } from '../../components/recommendations/recommendations.component';
import { Router } from '@angular/router';
import { TranslateService } from '../../core/services/translate.service';

interface LinkTokenResponse {
  linkToken: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSnackBarModule,
    TranslatePipe,
    AlertsComponent,
    RecommendationsComponent
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {
  isLoading = false;
  isSyncing = false;
  plaidSubscription: Subscription | undefined;
  intelligenceSubscription: Subscription | undefined;
  alerts: Alert[] = [];
  recommendations: Recommendation[] = [];

  private snackBarConfig: MatSnackBarConfig = {
    duration: 5000,
    horizontalPosition: 'center',
    verticalPosition: 'top',
    panelClass: ['custom-notification']
  };

  constructor(
    private intelligenceService: IntelligenceService,
    private plaidService: PlaidService,
    private snackBar: MatSnackBar,
    private router: Router,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.loadIntelligenceData();
    this.setupPlaidSubscription();
  }

  ngOnDestroy() {
    if (this.plaidSubscription) {
      this.plaidSubscription.unsubscribe();
    }
    if (this.intelligenceSubscription) {
      this.intelligenceSubscription.unsubscribe();
    }
  }

  private setupPlaidSubscription() {
    this.plaidSubscription = this.plaidService.plaidEvents$.subscribe(event => {
      if (event.success) {
        this.translateService.translate('dashboard.connectionSuccess').subscribe((message: string) => {
          this.showNotification(
            message.replace('{{institution}}', event.institutionName || ''),
            'success'
          );
        });
      } else {
        this.translateService.translate('dashboard.connectionError').subscribe((message: string) => {
          this.showNotification(message, 'error');
        });
      }
    });
  }

  private showNotification(message: string, type: 'error' | 'success' | 'info' | 'warning') {
    this.snackBar.openFromComponent(CustomNotificationComponent, {
      ...this.snackBarConfig,
      data: { message, type }
    });
  }

  private handleError(error: any, defaultMessage: string) {
    console.error('Error:', error);
    this.showNotification(error?.message || defaultMessage, 'error');
  }

  loadIntelligenceData(): void {
    this.isLoading = true;
    this.intelligenceSubscription = this.intelligenceService.getIntelligenceData().subscribe({
      next: (data: IntelligenceData) => {
        this.alerts = data.alerts;
        this.recommendations = data.recommendations;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.isLoading = false;
        this.translateService.translate('dashboard.intelligenceLoadError').subscribe((message: string) => {
          this.handleError(error, message);
        });
      }
    });
  }

  syncWithPlaid(): void {
    this.isLoading = true;
    this.plaidService.createLinkToken().subscribe({
      next: (response: LinkTokenResponse) => {
        this.plaidService.openPlaidLink(response.linkToken);
        this.isLoading = false;
      },
      error: (error: Error) => {
        console.error('Error creating link token:', error);
        this.isLoading = false;
        this.translateService.translate('dashboard.plaidConnectionError').subscribe((message: string) => {
          this.showNotification(message, 'error');
        });
      }
    });
  }

  resolveAlert(alertId: string): void {
    this.intelligenceService.resolveAlert(alertId).subscribe({
      next: () => {
        this.alerts = this.alerts.filter(alert => alert.id !== alertId);
        this.translateService.translate('dashboard.alertDismissed').subscribe((message: string) => {
          this.showNotification(message, 'info');
        });
      },
      error: (error: any) => {
        this.translateService.translate('dashboard.alertDismissError').subscribe((message: string) => {
          this.handleError(error, message);
        });
      }
    });
  }

  resolveRecommendation(recommendationId: string): void {
    this.intelligenceService.resolveRecommendation(recommendationId).subscribe({
      next: () => {
        this.recommendations = this.recommendations.filter(rec => rec.id !== recommendationId);
        this.translateService.translate('dashboard.recommendationDismissed').subscribe((message: string) => {
          this.showNotification(message, 'info');
        });
      },
      error: (error: any) => {
        this.translateService.translate('dashboard.recommendationDismissError').subscribe((message: string) => {
          this.handleError(error, message);
        });
      }
    });
  }

  viewAllAlerts(): void {
    this.router.navigate(['/alerts']);
  }

  viewAllRecommendations(): void {
    this.router.navigate(['/recommendations']);
  }
} 