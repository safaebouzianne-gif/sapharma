import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.currentUserValue) {
    // Check role if required by route
    const requiredRole = route.data?.['role'];
    if (requiredRole) {
      if (authService.currentUserValue.role === requiredRole) {
        return true;
      } else {
        // user role doesn't match required
        router.navigate(['/']); // or unauthorized page
        return false;
      }
    }
    // logged in and no specific role required
    return true;
  }

  // Not logged in
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.currentUserValue && authService.isAdmin()) {
    return true;
  }
  
  router.navigate(['/login']);
  return false;
};
