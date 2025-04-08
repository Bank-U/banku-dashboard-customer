import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    MatMenuModule,
    MatDividerModule,
    MatTooltipModule,
    TranslatePipe
  ],
  template: `
    <mat-toolbar color="primary" class="header-toolbar">
      <div class="header-content">
        <div class="header-left">
          <button mat-icon-button (click)="toggleSidebar()" [matTooltip]="'common.menu' | translate | async">
            <mat-icon>menu</mat-icon>
          </button>
          <div class="header-title">
            <mat-icon class="header-icon">account_balance</mat-icon>
            <span>BankU</span>
          </div>
        </div>
        
        <div class="header-actions">
          <button mat-icon-button [matBadge]="notificationCount" matBadgeColor="warn" matBadgeSize="small" [matTooltip]="'common.notifications' | translate | async">
            <mat-icon>notifications</mat-icon>
          </button>
          
          <button mat-icon-button [matTooltip]="'common.profile' | translate | async">
            <mat-icon>account_circle</mat-icon>
          </button>
        </div>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 1000;
    }
    
    .header-toolbar {
      width: 100%;
      padding: 0;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding: 0 1rem;
      height: 64px;
    }
    
    .header-left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .header-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.25rem;
      font-weight: 500;
    }
    
    .header-icon {
      font-size: 1.5rem;
      height: 1.5rem;
      width: 1.5rem;
    }
    
    .header-actions {
      display: flex;
      gap: 0.5rem;
    }
    
    @media (max-width: 768px) {
      .header-title span {
        display: none;
      }
      
      .header-content {
        padding: 0 0.5rem;
      }
    }
  `]
})
export class HeaderComponent {
  notificationCount: number = 3;
  
  constructor() {}
  
  toggleSidebar(): void {
    // Implementar lógica para mostrar/ocultar el sidebar en dispositivos móviles
    console.log('Toggle sidebar');
  }
} 