import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  if (typeof window !== 'undefined' && window.localStorage) {
    const stored = localStorage.getItem('sio_user');
    if (stored) {
      try {
        const user = JSON.parse(stored);
        if (user?.token) {
          req = req.clone({
            setHeaders: {
              Authorization: `Bearer ${user.token}`
            }
          });
        }
      } catch (error) {
        console.error('Error parsing stored user data', error);
      }
    }
  }
  return next(req);
};
