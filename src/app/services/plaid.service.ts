import { Injectable } from '@angular/core';
import { Observable, throwError, Subject, take, switchMap } from 'rxjs';
import { AuthService } from './auth.service';
import { ApiService } from './api.service';
import { StateService } from '../core/services/state.service';

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
  private plaidEvents = new Subject<PlaidEventData>();

  plaidEvents$ = this.plaidEvents.asObservable();
  private selectedInstitution: string = '';

  constructor(
    private readonly authService: AuthService,
    private readonly apiService: ApiService,
    private readonly stateService: StateService
  ) {}

  createLinkToken(): Observable<LinkTokenResponse> {
    const userId = this.authService.getUserId();
    if (!userId) {
      return throwError(() => new Error('No user ID available'));
    }
    return this.stateService.getLanguage().pipe(
      take(1),
      switchMap(language => 
        this.apiService.post<LinkTokenResponse>(`/v1/openbanking/link-token`, { 
          userId, 
          language: language ?? "en" 
        })
      )
    );
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
    const userId = this.authService.getUserId();
    if (!userId) {
      return throwError(() => new Error('No user ID available'));
    }

    const payload: ExchangeTokenRequest = {
      userId,
      publicToken
    };

    return this.apiService.post<any>(`/v1/openbanking/exchange-token`, payload);
  }
} 