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
import { firstValueFrom, Subscription, switchMap, take, combineLatest, map } from 'rxjs';
import { CustomNotificationComponent } from '../../components/custom-notification/custom-notification.component';
import { AlertsComponent } from '../../components/alerts/alerts.component';
import { RecommendationsComponent } from '../../components/recommendations/recommendations.component';
import { RouterModule } from '@angular/router';
import { TranslateService } from '../../core/services/translate.service';
import { UserService, UserInfo } from '../../services/user.service';
import { FinancialService } from '../../services/financial.service';
import { StateService } from '../../core/services/state.service';
import { Language } from '../../core/models/app-state.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
    MatProgressSpinnerModule,
    RouterModule,
    RecommendationsComponent
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {
  isLoading = false;
  isSyncing = false;
  plaidSubscription: Subscription | undefined;
  intelligenceSubscription: Subscription | undefined;
  hasFinishedProcessingSubscription: Subscription | undefined;
  alerts: Alert[] = [];
  recommendations: Recommendation[] = [];
  userInfo: UserInfo | null = null;
  accounts: any[] = [];
  transactions: any[] = [];
  currentMotivationalMessage = '';
  isConnectingPlaid$ = this.plaidService.isConnectingPlaid$;
  isProcessingData$ = this.plaidService.isProcessingData$;
  isLoading$ = combineLatest([
    this.isProcessingData$,
    this.isConnectingPlaid$
  ]).pipe(
    map(([processing, connecting]) => !!processing || !!connecting)
  );

  private readonly snackBarConfig: MatSnackBarConfig = {
    duration: 5000,
    horizontalPosition: 'center',
    verticalPosition: 'top',
    panelClass: ['custom-notification']
  };

  constructor(
    private readonly intelligenceService: IntelligenceService,
    private readonly plaidService: PlaidService,
    private readonly snackBar: MatSnackBar,
    private readonly translateService: TranslateService,
    private readonly userService: UserService,
    private readonly financialService: FinancialService,
    private readonly stateService: StateService
  ) {}

  ngOnInit() {
    this.loadUserInfo();
    this.loadAccounts();
    this.loadTransactions();
    this.loadIntelligenceData();
    this.setupPlaidSubscription();
    this.setupIntelligenceSubscription();
    this.setRandomMotivationalMessage();
  }

  ngOnDestroy() {
    console.log('DashboardComponent ngOnDestroy');
    if (this.plaidSubscription) {
      this.plaidSubscription.unsubscribe();
    }
    if (this.intelligenceSubscription) {
      this.intelligenceSubscription.unsubscribe();
    }
    if (this.hasFinishedProcessingSubscription) {
      this.hasFinishedProcessingSubscription.unsubscribe();
    }
  }

  private setupIntelligenceSubscription() {
    this.hasFinishedProcessingSubscription = this.plaidService.hasFinishedProcessing
      .pipe(take(1))
      .subscribe(async () => {
        this.loadAccounts();
        this.loadTransactions();
        this.loadIntelligenceData();
        await firstValueFrom(this.translateService.translate('dashboard.intelligenceProcessed')).then((message: string) => {
          this.showNotification(message, 'success');
        });
      });
  }

  private setupPlaidSubscription() {
    this.plaidSubscription = this.plaidService.plaidEvents$.subscribe(async (event) => {
      if (event.success) {
        await firstValueFrom(this.translateService.translate('dashboard.connectionSuccess')).then((message: string) => {
          this.showNotification(
            message.replace('{{institution}}', event.institutionName ?? ''),
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
    this.showNotification(error?.message ?? defaultMessage, 'error');
  }

  loadIntelligenceData(): void {
    this.intelligenceService.getIntelligenceData()
    .subscribe({
      next: (intelligenceData: IntelligenceData) => {
        this.alerts = intelligenceData.alerts;
        this.recommendations = intelligenceData.recommendations;
      },
      error: (error: Error) => {
        console.error('Error loading intelligence data:', error);
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

  private loadUserInfo() {
    this.userService.getUserInfo().subscribe({
      next: (userInfo) => {
        this.userInfo = userInfo;
        const language = this.userInfo.preferredLanguage as Language;
        this.stateService.updateUiState({ language });
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
      },
      error: (error) => {
        console.error('Error loading accounts:', error);
      }
    });
  }

  private loadTransactions() {
    this.financialService.getTransactions().subscribe({
      next: (transactions) => {
        this.transactions = transactions;
      },
      error: (error) => {
        console.error('Error loading transactions:', error);
      }
    });
  }

  private setRandomMotivationalMessage() {
    const randomNumber = Math.floor(Math.random() * 10) + 1;
    this.translateService.translate(`motivationalMessages.message${randomNumber}`).subscribe(
      message => {
        this.currentMotivationalMessage = message;
      }
    );
  }
} 