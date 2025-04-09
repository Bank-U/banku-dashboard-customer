import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  
  if (authService.isAuthenticated()) {
    return true;
  }
  
  // Redirigir al login si no hay token
  router.navigate(['/login']);
  return false;
}; 