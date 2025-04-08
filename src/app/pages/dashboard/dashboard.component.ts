import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { PlaidService } from '../../services/plaid.service';
import { Subscription } from 'rxjs';

interface Transaction {
  category: string;
  product: string;
  merchant: string;
  amount: number;
  pending: boolean;
  currency: string;
  date: string;
  account: string;
  balance: number;
}

interface LinkTokenResponse {
  linkToken: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSnackBarModule,
    TranslatePipe
  ],
  template: `
    <div class="dashboard-container p-6">
      <!-- Header with Sync Button -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-semibold">{{ 'common.dashboard' | translate | async }}</h1>
        <button mat-raised-button color="primary" class="sync-button" (click)="syncWithPlaid()" [disabled]="isLoading">
          <mat-icon *ngIf="isLoading" class="animate-spin">sync</mat-icon>
          <span>{{ 'common.sync' | translate | async }}</span>
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- Balance Card -->
        <div class="stat-card bg-white p-6 rounded-lg shadow">
          <div class="flex items-center gap-2 mb-2">
            <mat-icon class="text-green-600">account_balance_wallet</mat-icon>
            <span class="text-gray-600">Balance</span>
          </div>
          <div class="text-3xl font-bold">{{balance | number}}</div>
          <div class="text-sm text-green-600 mt-2">
            <span class="flex items-center">
              <mat-icon>trending_up</mat-icon>
              {{balanceChange}}% in the last month
            </span>
          </div>
        </div>

        <!-- Monthly Income Card -->
        <div class="stat-card bg-white p-6 rounded-lg shadow">
          <div class="flex items-center gap-2 mb-2">
            <mat-icon class="text-blue-600">trending_up</mat-icon>
            <span class="text-gray-600">Monthly Income</span>
          </div>
          <div class="text-3xl font-bold">{{monthlyIncome | number}}</div>
          <div class="text-sm text-green-600 mt-2">
            <span class="flex items-center">
              <mat-icon>trending_up</mat-icon>
              {{incomeChange}}% in the last month
            </span>
          </div>
        </div>

        <!-- Accounts Card -->
        <div class="stat-card bg-white p-6 rounded-lg shadow">
          <div class="flex items-center gap-2 mb-2">
            <mat-icon class="text-purple-600">account_balance</mat-icon>
            <span class="text-gray-600">Accounts</span>
          </div>
          <div class="text-3xl font-bold">{{totalAccounts}}</div>
        </div>
      </div>

      <!-- BankU Intelligence Section -->
      <div class="bg-white p-6 rounded-lg shadow mb-8">
        <h2 class="text-xl font-semibold mb-4">BankU Intelligence</h2>
        <div class="space-y-4">
          <div class="alert flex items-start gap-3 p-4 bg-red-50 rounded-lg">
            <mat-icon class="text-red-600">warning</mat-icon>
            <div>
              <h3 class="font-semibold text-red-600">Unusual spending detected</h3>
              <p class="text-gray-600">We've identified a significant spike in your transactions this week compared to your usual patterns.</p>
            </div>
          </div>

          <div class="alert flex items-start gap-3 p-4 bg-red-50 rounded-lg">
            <mat-icon class="text-red-600">warning</mat-icon>
            <div>
              <h3 class="font-semibold text-red-600">Possible duplicate charges</h3>
              <p class="text-gray-600">Two or more transactions with the same amount and merchant were posted within a short timeframe.</p>
            </div>
          </div>

          <div class="alert flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
            <mat-icon class="text-blue-600">info</mat-icon>
            <div>
              <h3 class="font-semibold text-blue-600">You could optimize unused subscriptions</h3>
              <p class="text-gray-600">Several recurring charges show no recent related activity. Consider reviewing these subscriptions.</p>
            </div>
          </div>

          <div class="alert flex items-start gap-3 p-4 bg-yellow-50 rounded-lg">
            <mat-icon class="text-yellow-600">warning</mat-icon>
            <div>
              <h3 class="font-semibold text-yellow-600">High spending in Entertainment</h3>
              <p class="text-gray-600">Your entertainment expenses have exceeded your monthly average by more than 35%.</p>
            </div>
          </div>
        </div>
        <div class="text-right mt-4">
          <a href="#" class="text-blue-600 hover:underline">View all alerts →</a>
        </div>
      </div>

      <!-- Latest Transactions -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-4">Latest Transactions</h2>
        <table mat-table [dataSource]="transactions" class="w-full">
          <!-- Category Column -->
          <ng-container matColumnDef="category">
            <th mat-header-cell *matHeaderCellDef>Category</th>
            <td mat-cell *matCellDef="let transaction">{{transaction.category}}</td>
          </ng-container>

          <!-- Product Column -->
          <ng-container matColumnDef="product">
            <th mat-header-cell *matHeaderCellDef>Product</th>
            <td mat-cell *matCellDef="let transaction">{{transaction.product}}</td>
          </ng-container>

          <!-- Merchant Column -->
          <ng-container matColumnDef="merchant">
            <th mat-header-cell *matHeaderCellDef>Merchant</th>
            <td mat-cell *matCellDef="let transaction">{{transaction.merchant}}</td>
          </ng-container>

          <!-- Amount Column -->
          <ng-container matColumnDef="amount">
            <th mat-header-cell *matHeaderCellDef>Amount</th>
            <td mat-cell *matCellDef="let transaction">{{transaction.amount | number:'1.2-2'}}</td>
          </ng-container>

          <!-- Status Column -->
          <ng-container matColumnDef="pending">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let transaction">
              <span [class]="transaction.pending ? 'text-orange-500' : 'text-green-500'">
                {{transaction.pending ? 'Pending' : 'Done'}}
              </span>
            </td>
          </ng-container>

          <!-- Currency Column -->
          <ng-container matColumnDef="currency">
            <th mat-header-cell *matHeaderCellDef>Currency</th>
            <td mat-cell *matCellDef="let transaction">{{transaction.currency}}</td>
          </ng-container>

          <!-- Date Column -->
          <ng-container matColumnDef="date">
            <th mat-header-cell *matHeaderCellDef>Date</th>
            <td mat-cell *matCellDef="let transaction">{{transaction.date}}</td>
          </ng-container>

          <!-- Account Column -->
          <ng-container matColumnDef="account">
            <th mat-header-cell *matHeaderCellDef>Account</th>
            <td mat-cell *matCellDef="let transaction">{{transaction.account}}</td>
          </ng-container>

          <!-- Balance Column -->
          <ng-container matColumnDef="balance">
            <th mat-header-cell *matHeaderCellDef>Balance</th>
            <td mat-cell *matCellDef="let transaction">{{transaction.balance | number:'1.2-2'}}</td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        <div class="text-right mt-4">
          <a href="#" class="text-blue-600 hover:underline">View all transactions →</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      background-color: var(--background-color);
    }
    .dashboard-container {
      max-width: 1400px;
      margin: 0 auto;
    }
    .sync-button {
      background-color: var(--primary-color) !important;
      color: white;
      font-weight: 500;
      padding: 0.5rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    .stat-card {
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      transition: all 0.3s ease;
    }
    .stat-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }
    .mat-mdc-table {
      background: transparent !important;
      border-radius: 8px;
      overflow: hidden;
    }
    .mat-mdc-header-cell {
      background-color: #f8fafc;
      font-weight: 600;
      color: var(--text-secondary);
    }
    .mat-mdc-row {
      transition: background-color 0.2s ease;
    }
    .mat-mdc-row:hover {
      background-color: #f8fafc;
    }
    .alert {
      transition: transform 0.2s ease;
    }
    .alert:hover {
      transform: translateX(5px);
    }
    h1, h2 {
      color: var(--primary-color);
    }
    .text-green-600 {
      color: var(--success-color);
    }
    .text-blue-600 {
      color: var(--accent-color);
    }
    .text-purple-600 {
      color: #8e44ad;
    }
    .text-red-600 {
      color: var(--danger-color);
    }
    .text-yellow-600 {
      color: var(--warning-color);
    }
    .text-blue-600.hover\:underline:hover {
      text-decoration: underline;
    }
    @media (max-width: 768px) {
      .dashboard-container {
        padding: 1rem;
      }
    }
  `]
})
export class DashboardComponent implements OnInit, OnDestroy {
  private plaidSubscription: Subscription | null = null;
  isLoading = false;
  balance: number = 166580;
  balanceChange: number = 5;
  monthlyIncome: number = 5679;
  incomeChange: number = 2;
  totalAccounts: number = 5;

  displayedColumns: string[] = ['category', 'product', 'merchant', 'amount', 'pending', 'currency', 'date', 'account', 'balance'];
  
  transactions: Transaction[] = [
    {
      category: 'Food and Drink',
      product: '',
      merchant: 'KFC',
      amount: 500,
      pending: false,
      currency: 'USD',
      date: '2025-03-24',
      account: 'Plaid Checking',
      balance: 110
    },
    {
      category: 'Travel',
      product: 'Uber',
      merchant: 'SkyScanner',
      amount: 158,
      pending: true,
      currency: 'USD',
      date: '2025-03-24',
      account: 'Plaid Saving',
      balance: 1544
    },
    {
      category: 'Recreation',
      product: 'Fitness Centers',
      merchant: 'Champion',
      amount: 78.5,
      pending: true,
      currency: 'USD',
      date: '2025-03-23',
      account: 'Plaid CD',
      balance: 19
    },
    {
      category: 'Payment',
      product: 'Touchstone Climbing',
      merchant: 'Gym',
      amount: 79.95,
      pending: false,
      currency: 'USD',
      date: '2025-03-22',
      account: 'Plaid Money Market',
      balance: 3587
    }
  ];

  constructor(
    private plaidService: PlaidService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.plaidSubscription = this.plaidService.plaidEvents$.subscribe(event => {
      if (event.success) {
        this.snackBar.open(
          `Conexión exitosa con ${event.institutionName}`,
          'Cerrar',
          { 
            duration: 5000,
            panelClass: ['success-snackbar']
          }
        );
      } else {
        this.snackBar.open(
          'Error en la conexión con el banco. Por favor, inténtalo de nuevo.',
          'Cerrar',
          { 
            duration: 5000,
            panelClass: ['error-snackbar']
          }
        );
      }
    });
  }

  ngOnDestroy(): void {
    if (this.plaidSubscription) {
      this.plaidSubscription.unsubscribe();
    }
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
        this.snackBar.open(
          'Error al conectar con Plaid. Por favor, inténtalo de nuevo.',
          'Cerrar',
          { 
            duration: 5000,
            panelClass: ['error-snackbar']
          }
        );
      }
    });
  }
} 