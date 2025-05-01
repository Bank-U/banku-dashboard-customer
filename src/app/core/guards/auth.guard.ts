import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  
  if (authService.isAuthenticated() && !authService.isTokenExpired()) {
    return true;
  }
  
  // If token is expired or not authenticated, logout and redirect to login
  authService.logout();
  router.navigate(['/login']);
  return false;
}; 