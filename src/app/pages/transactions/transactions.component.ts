import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { FinancialService, Transaction } from '../../services/financial.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    TranslatePipe,
    DatePipe
  ],
  template: `
    <div class="page-container">
      <h1 class="page-title">{{ 'transactions.title' | translate | async }}</h1>
      
      <div class="page-content">
        <mat-card class="transactions-card" *ngIf="!loading; else loadingTemplate">
          <mat-card-header class="card-header">
            <mat-card-title>{{ 'transactions.recentTransactions' | translate | async }}</mat-card-title>
            
            <div class="search-container">
              <mat-form-field appearance="outline">
                <mat-label>{{ 'common.search' | translate | async }}</mat-label>
                <input matInput (keyup)="applyFilter($event)" placeholder="{{ 'common.search' | translate | async }}">
                <mat-icon class="material-symbols-outlined" matSuffix>search_outlined</mat-icon>
              </mat-form-field>
            </div>
          </mat-card-header>
          
          <mat-card-content>
            <div *ngIf="transactions.length > 0; else noTransactions">
              <div class="table-container">
                <table mat-table [dataSource]="dataSource" matSort class="transactions-table">
                  <!-- Date Column -->
                  <ng-container matColumnDef="date">
                    <th mat-header-cell *matHeaderCellDef mat-sort-header>{{ 'transactions.date' | translate | async }}</th>
                    <td mat-cell *matCellDef="let transaction">{{ transaction.date | date:'MMM d, y' }}</td>
                  </ng-container>
                  
                  <!-- Name Column -->
                  <ng-container matColumnDef="name">
                    <th mat-header-cell *matHeaderCellDef mat-sort-header>{{ 'transactions.description' | translate | async }}</th>
                    <td mat-cell *matCellDef="let transaction" class="description-cell">
                      <div class="transaction-name">{{ transaction.name }}</div>
                      <div class="merchant-name" *ngIf="transaction.merchantName">{{ transaction.merchantName }}</div>
                    </td>
                  </ng-container>
                  
                  <!-- Category Column -->
                  <ng-container matColumnDef="category">
                    <th mat-header-cell *matHeaderCellDef mat-sort-header>{{ 'transactions.category' | translate | async }}</th>
                    <td mat-cell *matCellDef="let transaction">{{ transaction.category }}</td>
                  </ng-container>
                  
                  <!-- Amount Column -->
                  <ng-container matColumnDef="amount">
                    <th mat-header-cell *matHeaderCellDef mat-sort-header>{{ 'transactions.amount' | translate | async }}</th>
                    <td mat-cell *matCellDef="let transaction" [ngClass]="{'negative': transaction.amount > 0, 'positive': transaction.amount < 0}">
                      {{ transaction.amount | currency:transaction.currency }}
                    </td>
                  </ng-container>
                  
                  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
                </table>
                
                <mat-paginator [pageSizeOptions]="[10, 25, 50]" showFirstLastButtons></mat-paginator>
              </div>
            </div>
            
            <ng-template #noTransactions>
              <div class="no-data-container">
                <mat-icon class="material-symbols-outlined no-data-icon">receipt_long_outlined</mat-icon>
                <h3>{{ 'transactions.noTransactions' | translate | async }}</h3>
                <p>{{ 'transactions.linkYourAccount' | translate | async }}</p>
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
          <button mat-button color="primary" (click)="loadTransactions()">
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
    
    .transactions-card {
      margin-bottom: 1.5rem;
      border-radius: 12px;
    }
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      padding-bottom: 0;
    }
    
    .search-container {
      min-width: 280px;
    }
    
    .search-container mat-form-field {
      width: 100%;
      font-size: 0.9rem;
    }
    
    .table-container {
      overflow-x: auto;
    }
    
    .transactions-table {
      width: 100%;
    }
    
    .description-cell {
      max-width: 300px;
    }
    
    .transaction-name {
      font-weight: 500;
      color: var(--text-primary);
    }
    
    .merchant-name {
      color: var(--text-secondary);
      font-size: 0.85rem;
    }
    
    .positive {
      color: #4caf50;
    }
    
    .negative {
      color: #f44336;
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
    
    @media (max-width: 768px) {
      .card-header {
        flex-direction: column;
        align-items: stretch;
      }
      
      .search-container {
        margin-top: 1rem;
      }
    }
  `]
})
export class TransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  displayedColumns: string[] = ['date', 'name', 'category', 'amount'];
  dataSource = new MatTableDataSource<Transaction>([]);
  loading = true;
  error = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private financialService: FinancialService) { }

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.loading = true;
    this.error = false;
    
    this.financialService.getTransactions()
      .pipe(
        catchError(err => {
          console.error('Error fetching transactions', err);
          this.error = true;
          return of([]);
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(transactions => {
        this.transactions = transactions;
        this.dataSource = new MatTableDataSource(this.transactions);
        
        setTimeout(() => {
          if (this.paginator && this.sort) {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }
        });
      });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
} 