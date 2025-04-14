import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { interval, Subscription } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TokenRefreshService implements OnDestroy {
  private refreshSubscription: Subscription | null = null;
  private readonly REFRESH_INTERVAL = environment.tokenRefreshInterval || 15 * 60 * 1000; // Default 15 minutes

  constructor(private authService: AuthService) {
    // Initialize the refresh timer immediately
    this.startRefreshTimer();
  }

  private startRefreshTimer(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }

    // Start with an immediate check
    if (this.authService.isAuthenticated() && !this.authService.isTokenExpired()) {
      this.authService.refreshToken().subscribe();
    }

    // Then set up the interval
    this.refreshSubscription = interval(this.REFRESH_INTERVAL)
      .subscribe(() => {
        if (this.authService.isAuthenticated() && !this.authService.isTokenExpired()) {
          this.authService.refreshToken().subscribe();
        }
      });
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }
} 