import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { CapitalizePipe } from '../../pipes/capitalize.pipe';
import { FinancialService, Account } from '../../services/financial.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatRippleModule,
    MatTooltipModule,
    TranslatePipe,
    CapitalizePipe
  ],
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {
  accounts: Account[] = [];
  loading = true;
  error = false;

  constructor(private readonly financialService: FinancialService) { }

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
        return 'credit_card';
      case 'loan':
        return 'receipt_long';
      case 'investment':
        return 'trending_up';
      case 'depository':
      case 'checking':
        return 'account_balance';
      case 'savings':
        return 'savings';
      default:
        return 'account_balance_wallet';
    }
  }

  getAccountTooltip(account: Account): string {
    return `${account.type} · ${account.subtype}`;
  }
}