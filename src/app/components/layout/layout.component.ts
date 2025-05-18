import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SidebarComponent
  ],
  template: `
    <div class="layout-container">
      <app-sidebar></app-sidebar>
      <div class="layout-content">
        <main id="main-content" class="main-content">
          <router-outlet></router-outlet>
        </main>
      </div>
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
      flex-direction: row;

      .layout-content {
        display: flex;
        justify-content: center;
        width: 100%;

        .sidebar-expanded {
          margin-left: 250px;
        }
        .sidebar-collapsed {
          margin-left: 60px;
        }

        :not(.sidebar-expanded) {
          margin-left: 60px;
        }
        
        .main-content {
          max-width: 1400px;
          flex: 1;
          padding: 32px 5rem;
          background-color: var(--background);
          min-height: calc(100vh - 64px);
          transition: margin-left 0.3s ease-in-out;

        }
      }
      
    }
    

    @media (max-width: 768px) {
      .sidebar-expanded {
        margin-left: 0px !important;
      }

      .sidebar-collapsed {
        .main-content {
          padding: 32px 1rem !important;
        }
      }

      .main-content {
        padding: 16px 2rem !important;
        margin-left: 0px !important;
      }
    }
  `]
})
export class LayoutComponent {
  constructor() {}
}   