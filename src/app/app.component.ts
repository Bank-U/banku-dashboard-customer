import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TokenRefreshService } from './services/token-refresh.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="app-container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
  `]
})
export class AppComponent {

  constructor(private readonly tokenRefreshService: TokenRefreshService) {
    // The service will be initialized when the component is created
  }
} 