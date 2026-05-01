import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

import {
  catchError,
  EMPTY,
  finalize,
  Observable,
  Subscription,
  take,
  tap,
  throwError,
  timer,
} from 'rxjs';

import { AuthResponse } from '@models/response/auth-response.model';

import { ApiHttpService } from './api-http.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private accessToken: string | null = null;
  private refreshSubscription: Subscription | null = null;

  constructor(
    private apiHttpService: ApiHttpService,
    private router: Router
  ) {}

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  getToken(): string | null {
    return this.accessToken;
  }

  isLoggedIn(): boolean {
    return !!this.accessToken;
  }

  logout() {
    this.accessToken = null;
    this.router.navigate(['/auth/login']);
    this.stopTokenRefreshTimer();
    this.apiHttpService
      .logout()
      .pipe(
        take(1),
        catchError(() => {
          return EMPTY;
        }),
        finalize(() => {
          this.router.navigate(['/auth/login']);
        })
      )
      .subscribe();
  }

  startTokenRefreshTimer(): void {
    this.stopTokenRefreshTimer();

    const payload = this.decodeAccessToken();
    if (!payload || !payload.exp) return;

    const expiresAt = payload.exp * 1000;
    const now = Date.now();

    const delay = expiresAt - now - 10000;

    if (delay <= 0) {
      this.refreshToken().subscribe();
      return;
    }

    this.refreshSubscription = timer(delay).subscribe(() => {
      this.refreshToken().subscribe();
    });
  }

  stopTokenRefreshTimer(): void {
    this.refreshSubscription?.unsubscribe();
    this.refreshSubscription = null;
  }

  refreshToken(): Observable<AuthResponse> {
    return this.apiHttpService.refreshToken().pipe(
      tap(res => {
        this.setAccessToken(res?.AccessToken);
        this.startTokenRefreshTimer();
      }),
      catchError(err => {
        this.logout();
        return throwError(() => err);
      })
    );
  }

  decodeAccessToken(): any | null {
    if (!this.accessToken) return null;
    try {
      return JSON.parse(atob(this.accessToken.split('.')[1]));
    } catch {
      return null;
    }
  }
}
