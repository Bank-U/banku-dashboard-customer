import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Account {
  accountId: string;
  name: string;
  type: string;
  subtype: string;
  balance: number;
  currency: string;
}

export interface Transaction {
  transactionId: string;
  accountId: string;
  amount: number;
  currency: string;
  date: string;
  name: string;
  merchantName: string;
  category: string;
}

@Injectable({
  providedIn: 'root'
})
export class FinancialService {
  constructor(private readonly apiService: ApiService) { }

  getAccounts(): Observable<Account[]> {
    return this.apiService.get<Account[]>(`/v1/openbanking/financial/accounts`);
  }

  getTransactions(): Observable<Transaction[]> {
    return this.apiService.get<Transaction[]>(`/v1/openbanking/financial/transactions`);
  }
} 