import { Component, OnInit } from '@angular/core';
import { PlaidService, LinkTokenResponse, ExchangeTokenRequest } from '../../services/plaid.service';

declare const Plaid: any;

@Component({
  selector: 'app-plaid-link',
  standalone: true,
  template: `
    <div class="plaid-link-container">
      <button (click)="openPlaidLink()" class="plaid-link-button">
        Connect Bank Account
      </button>
    </div>
  `,
  styles: [`
    .plaid-link-container {
      display: flex;
      justify-content: center;
      margin: 20px 0;
    }
    .plaid-link-button {
      padding: 12px 24px;
      background-color: #2d88ff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      transition: background-color 0.2s;
    }
    .plaid-link-button:hover {
      background-color: #1a75ff;
    }
  `]
})
export class PlaidLinkComponent implements OnInit {
  private handler: any;

  constructor(private plaidService: PlaidService) {}

  ngOnInit() {
    // Load Plaid Link script
    const script = document.createElement('script');
    script.src = 'https://cdn.plaid.com/link/v2/stable/link-initialize.js';
    script.async = true;
    document.body.appendChild(script);
  }

  openPlaidLink() {
    this.plaidService.createLinkToken().subscribe(
      (response: LinkTokenResponse) => {
        this.initializePlaidLink(response.link_token);
      },
      error => {
        console.error('Error creating link token:', error);
      }
    );
  }

  private initializePlaidLink(linkToken: string) {
    this.handler = Plaid.create({
      token: linkToken,
      onSuccess: (public_token: string, metadata: any) => {
        const request: ExchangeTokenRequest = {
          public_token,
          metadata
        };
        this.plaidService.exchangePublicToken(request).subscribe(
          response => {
            console.log('Successfully exchanged public token:', response);
            // Handle successful token exchange
          },
          error => {
            console.error('Error exchanging public token:', error);
          }
        );
      },
      onExit: (err: any, metadata: any) => {
        if (err) {
          console.error('Error during Plaid Link:', err);
        }
      },
      onEvent: (eventName: string, metadata: any) => {
        console.log('Plaid Link event:', eventName, metadata);
      },
      onLoad: () => {
        console.log('Plaid Link loaded');
      },
      onReady: () => {
        console.log('Plaid Link ready');
      },
      language: 'en',
      countryCodes: ['US'],
      product: ['auth']
    });

    this.handler.open();
  }
} 