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
      flex-direction: row;
    }
    
    .layout-content {
      display: flex;
    }
    
    .main-content {
      flex: 1;
      padding: 24px 5rem;
      background-color: var(--background);
      min-height: calc(100vh - 64px);
      overflow-y: auto;
    }
  `]
})
export class LayoutComponent {
  constructor() {}
}   