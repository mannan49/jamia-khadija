import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '@shared/services/auth.service';

export function appInitializer(authService: AuthService) {
  return () =>
    authService.refreshToken().pipe(
      catchError(err => {
        console.error('[AppInitializer] Token refresh failed on startup:', err);
        return of(null);
      })
    );
}
