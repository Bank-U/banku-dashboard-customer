import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SidebarComponent,
    HeaderComponent
  ],
  template: `
    <div class="layout-container">
      <app-sidebar></app-sidebar>
      <app-header></app-header>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
    }
    
    .layout-container {
      display: flex;
      height: 100%;
    }
    
    .main-content {
      flex: 1;
      padding: 2rem;
      margin-top: 64px;
      background-color: var(--background-color);
      min-height: calc(100vh - 64px);
      overflow-y: auto;
    }
    
    @media (max-width: 768px) {
      .main-content {
        margin-left: 60px;
      }
    }
  `]
})
export class LayoutComponent {
  constructor() {}
} 