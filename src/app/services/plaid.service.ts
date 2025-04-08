import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../core/services/auth.service';

interface LinkTokenResponse {
  linkToken: string;
}

interface ExchangeTokenRequest {
  userId: string;
  publicToken: string;
}

interface PlaidEventData {
  institutionName?: string;
  success?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PlaidService {
  private readonly apiUrl = 'http://localhost:8082/api/openbanking';
  private plaidEvents = new Subject<PlaidEventData>();

  plaidEvents$ = this.plaidEvents.asObservable();
  private selectedInstitution: string = '';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  createLinkToken(): Observable<LinkTokenResponse> {
    const headers = this.getHeaders();
    if (!headers) {
      return throwError(() => new Error('No authentication token available'));
    }

    const userId = this.authService.getUserId();
    if (!userId) {
      return throwError(() => new Error('No user ID available'));
    }
    
    return this.http.post<LinkTokenResponse>(`${this.apiUrl}/link-token`, { userId }, { headers });
  }

  openPlaidLink(token: string): void {
    const handler = (window as any).Plaid.create({
      token,
      onSuccess: (public_token: string, metadata: any) => {
        this.exchangePublicToken(public_token).subscribe({
          next: (response) => {
            console.log('Successfully exchanged token:', response);
            this.plaidEvents.next({
              success: true,
              institutionName: this.selectedInstitution
            });
          },
          error: (error) => {
            console.error('Error exchanging public token:', error);
            this.plaidEvents.next({
              success: false
            });
          }
        });
      },
      onExit: (err: any, metadata: any) => {
        if (err != null) {
          console.error('Error during Plaid Link flow:', err);
          this.plaidEvents.next({
            success: false
          });
        }
      },
      onEvent: (eventName: string, metadata: any) => {
        console.log('Plaid Link event:', eventName, metadata);
        if (eventName === 'SELECT_INSTITUTION') {
          this.selectedInstitution = metadata.institution_name;
        }
      }
    });

    handler.open();
  }

  private exchangePublicToken(publicToken: string): Observable<any> {
    const headers = this.getHeaders();
    if (!headers) {
      return throwError(() => new Error('No authentication token available'));
    }

    const userId = this.authService.getUserId();
    if (!userId) {
      return throwError(() => new Error('No user ID available'));
    }

    const payload: ExchangeTokenRequest = {
      userId,
      publicToken
    };

    return this.http.post(`${this.apiUrl}/exchange-token`, payload, { headers });
  }

  private getHeaders(): HttpHeaders | null {
    const token = this.authService.getToken();
    if (!token) {
      return null;
    }

    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }
} 