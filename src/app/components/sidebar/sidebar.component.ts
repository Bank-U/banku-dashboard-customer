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
import { AuthService } from '../../core/services/auth.service';

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
      <div class="logo-container">
        <mat-icon class="logo-icon">account_balance</mat-icon>
        <span class="logo-text">BankU</span>
      </div>
      
      <div class="menu-section">
        <div class="section-title">{{ 'sidebar.mainMenu' | translate | async }}</div>
        <mat-nav-list>
          <a mat-list-item routerLink="/home" routerLinkActive="active">
            <mat-icon matListItemIcon>home</mat-icon>
            <span matListItemTitle>{{ 'sidebar.home' | translate | async }}</span>
          </a>
          
          <a mat-list-item routerLink="/accounts" routerLinkActive="active">
            <mat-icon matListItemIcon>account_balance_wallet</mat-icon>
            <span matListItemTitle>{{ 'sidebar.accounts' | translate | async }}</span>
          </a>
          
          <a mat-list-item routerLink="/alerts" routerLinkActive="active">
            <mat-icon matListItemIcon>notifications</mat-icon>
            <span matListItemTitle>{{ 'sidebar.alerts' | translate | async }}</span>
          </a>
          
          <a mat-list-item routerLink="/transactions" routerLinkActive="active">
            <mat-icon matListItemIcon>receipt_long</mat-icon>
            <span matListItemTitle>{{ 'sidebar.transactions' | translate | async }}</span>
          </a>
        </mat-nav-list>
      </div>
      
      <mat-divider></mat-divider>
      
      <div class="menu-section">
        <div class="section-title">{{ 'sidebar.general' | translate | async }}</div>
        <mat-nav-list>
          <a mat-list-item routerLink="/settings" routerLinkActive="active">
            <mat-icon matListItemIcon>settings</mat-icon>
            <span matListItemTitle>{{ 'sidebar.settings' | translate | async }}</span>
          </a>
        </mat-nav-list>
      </div>
      
      <div class="sidebar-footer">
        <button mat-button color="primary" class="logout-button" (click)="logout()">
          <mat-icon>logout</mat-icon>
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
      background-color: var(--card-background);
      box-shadow: 2px 0 5px rgba(0, 0, 0, 0.05);
      position: fixed;
      left: 0;
      top: 0;
      z-index: 1000;
    }
    
    .logo-container {
      display: flex;
      align-items: center;
      padding: 1.5rem 1rem;
      background-color: var(--primary-color);
      color: white;
    }
    
    .logo-icon {
      font-size: 2rem;
      height: 2rem;
      width: 2rem;
      margin-right: 0.5rem;
    }
    
    .logo-text {
      font-size: 1.5rem;
      font-weight: 600;
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
      .sidebar-container {
        width: 60px;
      }
      
      .logo-text, 
      a.mat-list-item span,
      .logout-button span,
      .section-title {
        display: none;
      }
      
      .logo-container {
        justify-content: center;
        padding: 1rem 0;
      }
      
      .logo-icon {
        margin-right: 0;
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
    private translateService: TranslateService,
    private authService: AuthService,
    private router: Router
  ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
} 