import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';

import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from '@shared/services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.isAuthEndpoint(req.url) || this.isS3Upload(req.url)) {
      return next.handle(req);
    }

    const accessToken = this.authService.getToken();

    const authReq = accessToken
      ? req.clone({
          setHeaders: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        })
      : req.clone({ withCredentials: true });

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !this.isRefreshRequest(req.url)) {
          return this.authService.refreshToken().pipe(
            switchMap(res => {
              this.authService.setAccessToken(res?.AccessToken);
              this.authService.startTokenRefreshTimer();
              const retryReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${res?.AccessToken}`,
                },
                withCredentials: true,
              });
              return next.handle(retryReq);
            }),
            catchError(refreshError => {
              this.authService.logout();
              return throwError(() => refreshError);
            })
          );
        }
        return throwError(() => error);
      })
    );
  }

  private isAuthEndpoint(url: string): boolean {
    return url.includes('/login') || url.includes('/refresh-token');
  }

  private isRefreshRequest(url: string): boolean {
    return url.includes('/refresh-token');
  }

  private isS3Upload(url: string): boolean {
    return url.includes('amazonaws.com');
  }
}
