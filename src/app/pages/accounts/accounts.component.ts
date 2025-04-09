import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { FinancialService, Account } from '../../services/financial.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    TranslatePipe
  ],
  template: `
    <div class="page-container">
      <h1 class="page-title">{{ 'accounts.title' | translate | async }}</h1>
      
      <div class="page-content">
        <mat-card class="accounts-card" *ngIf="!loading; else loadingTemplate">
          <mat-card-header>
            <mat-card-title>{{ 'accounts.yourAccounts' | translate | async }}</mat-card-title>
            <mat-card-subtitle>{{ 'accounts.subtitle' | translate | async }}</mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content>
            <div *ngIf="accounts.length > 0; else noAccounts" class="accounts-container">
              <div *ngFor="let account of accounts" class="account-item">
                <div class="account-icon">
                  <mat-icon class="material-symbols-outlined">{{ getAccountIcon(account.type) }}</mat-icon>
                </div>
                <div class="account-details">
                  <h3 class="account-name">{{ account.name }}</h3>
                  <div class="account-type">{{ account.type }} · {{ account.subtype }}</div>
                  <div class="account-balance">{{ account.balance | currency:account.currency }}</div>
                </div>
              </div>
            </div>
            
            <ng-template #noAccounts>
              <div class="no-data-container">
                <mat-icon class="material-symbols-outlined no-data-icon">account_balance_wallet_outlined</mat-icon>
                <h3>{{ 'accounts.noAccounts' | translate | async }}</h3>
                <p>{{ 'accounts.linkYourAccount' | translate | async }}</p>
              </div>
            </ng-template>
          </mat-card-content>
        </mat-card>
        
        <ng-template #loadingTemplate>
          <div class="loading-container">
            <mat-spinner diameter="50"></mat-spinner>
            <p>{{ 'common.loading' | translate | async }}</p>
          </div>
        </ng-template>
        
        <div *ngIf="error" class="error-message">
          <mat-icon class="material-symbols-outlined">error_outlined</mat-icon>
          <p>{{ 'common.errorLoading' | translate | async }}</p>
          <button mat-button color="primary" (click)="loadAccounts()">
            {{ 'common.tryAgain' | translate | async }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    
    .page-title {
      margin-bottom: 1.5rem;
      color: var(--text-primary);
      font-size: 1.75rem;
      font-weight: 500;
    }
    
    .accounts-card {
      margin-bottom: 1.5rem;
      border-radius: 12px;
    }
    
    .accounts-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }
    
    .account-item {
      display: flex;
      padding: 1.25rem;
      background-color: var(--card-background);
      border-radius: 12px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    
    .account-item:hover {
      transform: translateY(-3px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }
    
    .account-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 50px;
      width: 50px;
      background-color: rgba(var(--primary-color-rgb), 0.1);
      border-radius: 50%;
      margin-right: 1rem;
    }
    
    .account-icon mat-icon {
      color: var(--primary-color);
      font-size: 1.5rem;
      height: 1.5rem;
      width: 1.5rem;
    }
    
    .account-details {
      flex: 1;
    }
    
    .account-name {
      margin: 0 0 0.25rem;
      font-weight: 500;
      font-size: 1.125rem;
      color: var(--text-primary);
    }
    
    .account-type {
      color: var(--text-secondary);
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
    }
    
    .account-balance {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--primary-color);
    }
    
    .no-data-container, .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem 0;
      color: var(--text-secondary);
      text-align: center;
    }
    
    .no-data-icon {
      font-size: 3rem;
      height: 3rem;
      width: 3rem;
      margin-bottom: 1rem;
      color: var(--text-secondary);
      opacity: 0.5;
    }
    
    .error-message {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1.5rem;
      background-color: #ffebee;
      border-radius: 8px;
      color: #c62828;
      text-align: center;
    }
    
    .error-message mat-icon {
      margin-bottom: 0.5rem;
      font-size: 2rem;
      height: 2rem;
      width: 2rem;
    }
  `]
})
export class AccountsComponent implements OnInit {
  accounts: Account[] = [];
  loading = true;
  error = false;

  constructor(private financialService: FinancialService) { }

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.loading = true;
    this.error = false;
    
    this.financialService.getAccounts()
      .pipe(
        catchError(err => {
          console.error('Error fetching accounts', err);
          this.error = true;
          return of([]);
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(accounts => {
        this.accounts = accounts;
      });
  }

  getAccountIcon(type: string): string {
    switch (type?.toLowerCase()) {
      case 'credit':
        return 'credit_card_outlined';
      case 'loan':
        return 'receipt_long_outlined';
      case 'investment':
        return 'trending_up_outlined';
      case 'depository':
      case 'checking':
        return 'account_balance_outlined';
      case 'savings':
        return 'savings_outlined';
      default:
        return 'account_balance_wallet_outlined';
    }
  }
}