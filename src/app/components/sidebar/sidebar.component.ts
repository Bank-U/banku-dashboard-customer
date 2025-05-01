import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '../../pipes/translate.pipe';
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
      <div routerLink="/dashboard" class="sidebar-logo-container">
        <img src="assets/images/white-logo.png" alt="BankU Logo" class="sidebar-logo">
        <span class="sidebar-brand-name">BankU</span>
      </div>
        <mat-nav-list>
          <a mat-list-item routerLink="/dashboard" routerLinkActive="active">
            <mat-icon class="material-symbols-outlined" matListItemIcon>home_outlined</mat-icon>
            <span matListItemTitle>{{ 'sidebar.home' | translate | async }}</span>
          </a>
          
          <a mat-list-item routerLink="/intelligence" routerLinkActive="active">
            <mat-icon class="material-symbols-outlined" matListItemIcon>bubble_chart_outlined</mat-icon>
            <span matListItemTitle>{{ 'sidebar.intelligence' | translate | async }}</span>
          </a>
          
          <a mat-list-item routerLink="/accounts" routerLinkActive="active">
            <mat-icon class="material-symbols-outlined" matListItemIcon>account_balance_wallet_outlined</mat-icon>
            <span matListItemTitle>{{ 'sidebar.accounts' | translate | async }}</span>
          </a>
          
          <a mat-list-item routerLink="/transactions" routerLinkActive="active">
            <mat-icon class="material-symbols-outlined" matListItemIcon>receipt_long_outlined</mat-icon>
            <span matListItemTitle>{{ 'sidebar.transactions' | translate | async }}</span>
          </a>
        </mat-nav-list>
      </div>
      
      <mat-divider class="sidebar-divider"></mat-divider>
      
      <div class="menu-section">
        <mat-nav-list>
          <a mat-list-item routerLink="/settings" routerLinkActive="active">
            <mat-icon class="material-symbols-outlined" matListItemIcon>settings_outlined</mat-icon>
            <span matListItemTitle>{{ 'sidebar.settings' | translate | async }}</span>
          </a>
        </mat-nav-list>
      </div>
      
      <div class="sidebar-footer">
        <mat-nav-list>
          <a mat-list-item (click)="logout()">
            <mat-icon class="material-symbols-outlined" matListItemIcon>logout_outlined</mat-icon>
            <span matListItemTitle>{{ 'common.logout' | translate | async }}</span>
          </a>
        </mat-nav-list>
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
    .sidebar-brand-name {
      font-size: 24px;
      font-weight: 100;
    }
    .sidebar-logo-container {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      width: 100%;
      height: 75px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      
      /* White line animation on hover */
      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: -100%;
        width: 100%;
        height: 1px;
        background-color: white;
        transition: left 0.3s ease-in-out;
      }
      
      &:hover::after {
        left: 0;
      }
    }

    .sidebar-logo {
      width: 30px;
      height: 30px;
    }
    
    .sidebar-divider {
      margin: 0 auto;
      width: 80%;
    }
    .menu-section {
      padding: 1rem 0;
    }
    
    mat-nav-list {
      padding-top: 0.5rem;
    }
    
    a.mat-mdc-list-item {
      height: 48px;
      transition: background-color 0.2s ease;
    }
    
    a.mat-mdc-list-item:hover {
      background-color: rgba(0, 0, 0, 0.2);
    }
    
    a.mat-mdc-list-item.active {
      background-color: rgba(255, 255, 255, 0.15);
    }
    
    a.mat-mdc-list-item.active mat-icon {
      color: white;
    }
    
    mat-icon {
      margin-right: 0.5rem;
      color: var(--text-secondary);
    }
    
    .sidebar-footer {
      margin-top: auto;
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
      .sidebar-brand-name {
        display: none;
      }

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
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
} 