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
import { firstValueFrom, Subscription } from 'rxjs';
import { CustomNotificationComponent } from '../../components/custom-notification/custom-notification.component';
import { AlertsComponent } from '../../components/alerts/alerts.component';
import { RecommendationsComponent } from '../../components/recommendations/recommendations.component';
import { Router } from '@angular/router';
import { TranslateService } from '../../core/services/translate.service';
import { UserService, UserInfo } from '../../services/user.service';
import { FinancialService } from '../../services/financial.service';

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
  userInfo: UserInfo | null = null;
  accounts: any[] = [];
  hasAccounts = false;

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
    private translateService: TranslateService,
    private userService: UserService,
    private financialService: FinancialService
  ) {}

  ngOnInit() {
    this.loadUserInfo();
    this.loadAccounts();
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
    this.plaidSubscription = this.plaidService.plaidEvents$.subscribe(async (event) => {
      if (event.success) {
        await firstValueFrom(this.translateService.translate('dashboard.connectionSuccess')).then((message: string) => {
          this.showNotification(
            message.replace('{{institution}}', event.institutionName || ''),
            'success'
          );
        });
      } else {
        await firstValueFrom(this.translateService.translate('dashboard.connectionError')).then((message: string) => {
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
      next: async (data: IntelligenceData) => {
        this.alerts = data.alerts;
        this.recommendations = data.recommendations;
        this.isLoading = false;
      },
      error: async (error: any) => {
        this.isLoading = false;
        await firstValueFrom(this.translateService.translate('dashboard.intelligenceLoadError')).then((message: string) => {
          this.handleError(error, message);
        });
      }
    });
  }

  syncWithPlaid(): void {
    this.isLoading = true;
    this.plaidService.createLinkToken().subscribe({
      next: async (response: LinkTokenResponse) => {
        this.plaidService.openPlaidLink(response.linkToken);
        this.isLoading = false;
      },
      error: async (error: Error) => {
        console.error('Error creating link token:', error);
        this.isLoading = false;
        await firstValueFrom(this.translateService.translate('dashboard.plaidConnectionError')).then((message: string) => {
          this.showNotification(message, 'error');
        });
      }
    });
  }

  resolveAlert(alertId: string): void {
    this.intelligenceService.resolveAlert(alertId).subscribe({
      next: async () => {
        this.alerts = this.alerts.filter(alert => alert.id !== alertId);
        await firstValueFrom(this.translateService.translate('dashboard.alertDismissed')).then((message: string) => {
          this.showNotification(message, 'info');
        });
      },
      error: async (error: any) => {
        await firstValueFrom(this.translateService.translate('dashboard.alertDismissError')).then((message: string) => {
          this.handleError(error, message);
        });
      }
    });
  }

  resolveRecommendation(recommendationId: string): void {
    this.intelligenceService.resolveRecommendation(recommendationId).subscribe({
      next: async () => {
        this.recommendations = this.recommendations.filter(rec => rec.id !== recommendationId);
        await firstValueFrom(this.translateService.translate('dashboard.recommendationDismissed')).then((message: string) => {
          this.showNotification(message, 'info');
        });
      },
      error: async (error: any) => {
        await firstValueFrom( this.translateService.translate('dashboard.recommendationDismissError')).then((message: string) => {
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

  private loadUserInfo() {
    this.userService.getUserInfo().subscribe({
      next: (userInfo) => {
        this.userInfo = userInfo;
      },
      error: (error) => {
        console.error('Error loading user info:', error);
      }
    });
  }

  private loadAccounts() {
    this.financialService.getAccounts().subscribe({
      next: (accounts) => {
        this.accounts = accounts;
        this.hasAccounts = accounts.length > 0;
        if (this.hasAccounts) {
          this.loadIntelligenceData();
        }
      },
      error: (error) => {
        console.error('Error loading accounts:', error);
        this.hasAccounts = false;
      }
    });
  }
} 