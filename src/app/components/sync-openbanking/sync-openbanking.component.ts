import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from '../loader/loader.component';
import { combineLatest, firstValueFrom, map, Subscription, take } from 'rxjs';
import { PlaidService } from '../../services/plaid.service';
import { TranslateService } from '../../core/services/translate.service';
import { CustomNotificationComponent } from '../custom-notification/custom-notification.component';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

interface LinkTokenResponse {
  linkToken: string;
}

@Component({
  selector: 'app-sync-openbanking',
  templateUrl: './sync-openbanking.component.html',
  styleUrls: ['./sync-openbanking.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    TranslatePipe,
    FormsModule,
    LoaderComponent
  ]
})
export class SyncOpenbankingComponent implements OnInit, OnDestroy {
  @Output() finishedProcessing = new EventEmitter<void>();

  private readonly snackBarConfig: MatSnackBarConfig = {
    duration: 5000,
    horizontalPosition: 'center',
    verticalPosition: 'top',
    panelClass: ['custom-notification']
  };
  isSyncing = false;
  hasFinishedProcessingSubscription: Subscription | undefined;
  plaidSubscription: Subscription | undefined;

  isConnectingPlaid$ = this.plaidService.isConnectingPlaid$;
  isProcessingData$ = this.plaidService.isProcessingData$;

  isLoading$ = combineLatest([
    this.isProcessingData$,
    this.isConnectingPlaid$
  ]).pipe(
    map(([processing, connecting]) => !!processing || !!connecting)
  );

  icons = ['attach_money_outlined', 'euro_symbol_outlined', 'currency_pound_outlined'];
  currentIcon = 0;
  private intervalId: any;

  constructor(
    private readonly plaidService: PlaidService,
    private readonly translateService: TranslateService,
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.setUpFinishedProcessingSubscription();
    this.setupPlaidSubscription();
    this.intervalId = setInterval(() => {
      this.currentIcon = (this.currentIcon + 1) % this.icons.length;
    }, 2000);
  }

  ngOnDestroy() {
    if (this.plaidSubscription) {
      this.plaidSubscription.unsubscribe();
    }
    if (this.hasFinishedProcessingSubscription) {
      this.hasFinishedProcessingSubscription.unsubscribe();
    }
    clearInterval(this.intervalId);
  }

  syncWithPlaid(): void {
    this.plaidService.createLinkToken().subscribe({
      next: async (response: LinkTokenResponse) => {
        this.plaidService.openPlaidLink(response.linkToken);
      },
      error: async (error: Error) => {
        console.error('Error creating link token:', error);
        await firstValueFrom(this.translateService.translate('openbanking.plaidConnectionError')).then((message: string) => {
          this.showNotification(message, 'error');
        });
      }
    });
  }

  private setUpFinishedProcessingSubscription() {
    this.hasFinishedProcessingSubscription = this.plaidService.hasFinishedProcessing
      .pipe(take(1))
      .subscribe(async () => {
        this.finishedProcessing.emit();
        await firstValueFrom(this.translateService.translate('openbanking.intelligenceProcessed')).then((message: string) => {
          this.showNotification(message, 'success');
        });
      });
  }

  private setupPlaidSubscription() {
    this.plaidSubscription = this.plaidService.plaidEvents$.subscribe(async (event) => {
      if (event.success) {
        await firstValueFrom(this.translateService.translate('openbanking.connectionSuccess')).then((message: string) => {
          this.showNotification(
            message.replace('{{institution}}', event.institutionName ?? ''),
            'success'
          );
        });
      } else {
        await firstValueFrom(this.translateService.translate('openbanking.connectionError')).then((message: string) => {
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
} 