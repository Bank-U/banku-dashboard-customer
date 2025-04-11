import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { FinancialService, Transaction, Account } from '../../services/financial.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { StateService } from '../../core/services/state.service';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatDividerModule,
    TranslatePipe,
    DatePipe
  ],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  accounts: Account[] = [];
  filteredTransactions: Transaction[] = [];
  loading = true;
  error = false;
  
  // Category and account filters using FormControl for multi-select
  categories: string[] = [];
  categoryControl = new FormControl<string[]>([]);
  accountControl = new FormControl<string[]>([]);
  
  // Date range filter
  dateRange = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  constructor(
    private financialService: FinancialService,
    private dateAdapter: DateAdapter<any>,
    private stateService: StateService
  ) {
    this.stateService.getLanguage().subscribe(lang => {
      this.dateAdapter.setLocale(lang);
    });
  }

  ngOnInit(): void {
    this.loadData();
    
    // Subscribe to filter changes
    this.dateRange.valueChanges.subscribe(() => {
      this.applyFilters();
    });
    
    this.categoryControl.valueChanges.subscribe(() => {
      this.applyFilters();
    });
    
    this.accountControl.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  loadData(): void {
    this.loading = true;
    this.error = false;
    
    // Load accounts
    this.financialService.getAccounts()
      .pipe(
        catchError(err => {
          console.error('Error fetching accounts', err);
          this.error = true;
          return of([]);
        })
      )
      .subscribe(accounts => {
        this.accounts = accounts;
        
        // Load transactions after accounts are loaded
        this.loadTransactions();
      });
  }
  
  loadTransactions(): void {
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
        this.extractCategories();
        this.applyFilters();
      });
  }
  
  extractCategories(): void {
    // Extract unique categories from all transactions
    const categorySet = new Set<string>();
    
    this.transactions.forEach(transaction => {
      if (transaction.category) {
        // Handle category strings in JSON format like "[Travel, Credit Card]"
        const categories = this.getCategories(transaction.category);
        categories.forEach(category => categorySet.add(category));
      }
    });
    
    this.categories = Array.from(categorySet);
  }
  
  getCategories(categoryString: string): string[] {
    try {
      // Try to parse if it's a JSON string like "[Travel, Credit Card]"
      if (categoryString.startsWith('[') && categoryString.endsWith(']')) {
        return categoryString
          .slice(1, -1)
          .split(',')
          .map(cat => cat.trim());
      }
      // If not, return as single category
      return [categoryString];
    } catch {
      return [categoryString];
    }
  }
  
  getAccountName(accountId: string): string {
    const account = this.accounts.find(a => a.accountId === accountId);
    return account ? account.name : accountId;
  }
  
  applyFilters(): void {
    let filtered = [...this.transactions];
    
    // Apply date filter
    if (this.dateRange.value.start && this.dateRange.value.end) {
      const startDate = new Date(this.dateRange.value.start);
      const endDate = new Date(this.dateRange.value.end);
      
      filtered = filtered.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= startDate && transactionDate <= endDate;
      });
    }
    
    // Apply category filter (multi-select)
    if (this.categoryControl.value && this.categoryControl.value.length > 0) {
      filtered = filtered.filter(transaction => {
        const transactionCategories = this.getCategories(transaction.category);
        return transactionCategories.some(category => 
          this.categoryControl.value?.includes(category)
        );
      });
    }
    
    // Apply account filter (multi-select)
    if (this.accountControl.value && this.accountControl.value.length > 0) {
      filtered = filtered.filter(transaction => {
        const accountName = this.getAccountName(transaction.accountId);
        return this.accountControl.value?.includes(accountName);
      });
    }
    
    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    this.filteredTransactions = filtered;
  }
  
  clearDateRange(event: Event): void {
    event.stopPropagation();
    this.dateRange.reset();
  }

  clearCategoryFilter(event: Event): void {
    event.stopPropagation();
    this.categoryControl.reset();
  }

  clearAccountFilter(event: Event): void {
    event.stopPropagation();
    this.accountControl.reset();
  }
} 