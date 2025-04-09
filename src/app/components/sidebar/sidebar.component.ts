import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { TranslateService } from '../../core/services/translate.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatTooltipModule,
    TranslatePipe
  ],
  template: `
    <div class="sidebar-container">
      <div class="menu-section">
        <mat-nav-list>
          <a mat-list-item routerLink="/dashboard" routerLinkActive="active">
            <mat-icon class="material-symbols-outlined" matListItemIcon>home_outlined</mat-icon>
            <span matListItemTitle>{{ 'sidebar.home' | translate | async }}</span>
          </a>
          
          <a mat-list-item routerLink="/accounts" routerLinkActive="active">
            <mat-icon class="material-symbols-outlined" matListItemIcon>account_balance_wallet_outlined</mat-icon>
            <span matListItemTitle>{{ 'sidebar.accounts' | translate | async }}</span>
          </a>
          
          <a mat-list-item routerLink="/alerts" routerLinkActive="active">
            <mat-icon class="material-symbols-outlined" matListItemIcon>notifications_outlined</mat-icon>
            <span matListItemTitle>{{ 'sidebar.alerts' | translate | async }}</span>
          </a>
          
          <a mat-list-item routerLink="/transactions" routerLinkActive="active">
            <mat-icon class="material-symbols-outlined" matListItemIcon>receipt_long_outlined</mat-icon>
            <span matListItemTitle>{{ 'sidebar.transactions' | translate | async }}</span>
          </a>
        </mat-nav-list>
      </div>
      
      <mat-divider class="sidebar-divider"></mat-divider>
      
      <div class="menu-section">
        <div class="section-title">{{ 'sidebar.general' | translate | async }}</div>
        <mat-nav-list>
          <a mat-list-item routerLink="/settings" routerLinkActive="active">
            <mat-icon class="material-symbols-outlined" matListItemIcon>settings_outlined</mat-icon>
            <span matListItemTitle>{{ 'sidebar.settings' | translate | async }}</span>
          </a>
        </mat-nav-list>
      </div>
      
      <div class="sidebar-footer">
        <button mat-button color="primary" class="logout-button" (click)="logout()">
          <mat-icon class="material-symbols-outlined">logout_outlined</mat-icon>
          <span>{{ 'common.logout' | translate | async }}</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
      width: 250px;
    }
    
    .sidebar-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 250px;
      background-color: var(--background-dark);
      box-shadow: 2px 0 5px rgba(0, 0, 0, 0.05);
      z-index: 1000;
      color: white;
      font-family: 'Roboto';
      font-weight: 100;
      font-size: 14px;
    }
    
    .sidebar-divider {
      margin: 0 auto;
      width: 80%;
    }
    .menu-section {
      padding: 1rem 0;
    }
    
    .section-title {
      padding: 0 1.5rem;
      font-size: 0.75rem;
      font-weight: 500;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 0.5rem;
    }
    
    mat-nav-list {
      padding-top: 0.5rem;
    }
    
    a.mat-list-item {
      height: 48px;
      margin: 0.25rem 0.5rem;
      border-radius: 8px;
      transition: background-color 0.2s ease;
    }
    
    a.mat-list-item:hover {
      background-color: rgba(0, 0, 0, 0.04);
    }
    
    a.mat-list-item.active {
      background-color: rgba(var(--primary-color-rgb), 0.1);
      color: var(--primary-color);
    }
    
    mat-icon {
      margin-right: 0.5rem;
      color: var(--text-secondary);
    }
    
    a.mat-list-item.active mat-icon {
      color: var(--primary-color);
    }
    
    .sidebar-footer {
      margin-top: auto;
      padding: 1rem;
    }
    
    .logout-button {
      width: 100%;
      justify-content: flex-start;
      padding-left: 1rem;
    }
    
    .logout-button mat-icon {
      margin-right: 0.5rem;
    }
    
    @media (max-width: 768px) {
      .sidebar-container, :host {
        width: 60px;
      }
      
      a.mat-list-item {
        justify-content: center;
        padding: 0;
      }
      
      mat-icon {
        margin-right: 0;
      }
      
      .logout-button {
        justify-content: center;
        padding-left: 0;
      }
    }
  `]
})
export class SidebarComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
} 