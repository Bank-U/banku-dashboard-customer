import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { IntelligenceService, Alert, Recommendation, IntelligenceData } from '../../services/intelligence.service';
import { firstValueFrom, Subscription, switchMap, take, combineLatest, map, Observable } from 'rxjs';
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
import { SyncOpenbankingComponent } from '../../components/sync-openbanking/sync-openbanking.component';

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
    RecommendationsComponent,
    SyncOpenbankingComponent
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {
  intelligenceSubscription: Subscription | undefined;
  alerts: Alert[] = [];
  recommendations: Recommendation[] = [];
  userInfo: UserInfo | null = null;
  accounts: any[] = [];
  transactions: any[] = [];
  currentMotivationalMessage = '';

  private readonly snackBarConfig: MatSnackBarConfig = {
    duration: 5000,
    horizontalPosition: 'center',
    verticalPosition: 'top',
    panelClass: ['custom-notification']
  };

  constructor(
    private readonly intelligenceService: IntelligenceService,
    private readonly snackBar: MatSnackBar,
    private readonly translateService: TranslateService,
    private readonly userService: UserService,
    private readonly financialService: FinancialService,
    private readonly stateService: StateService
  ) {}

  ngOnInit() {
    this.loadUserInfo();
    this.setRandomMotivationalMessage();
    this.fetchData();
  }

  ngOnDestroy() {
    if (this.intelligenceSubscription) {
      this.intelligenceSubscription.unsubscribe();
    }
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

  public fetchData(): void {
    this.loadIntelligenceData();
    this.loadAccounts();
    this.loadTransactions();
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