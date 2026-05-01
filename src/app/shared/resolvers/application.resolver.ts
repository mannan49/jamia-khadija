import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { catchError, EMPTY, filter, Observable, take, tap } from 'rxjs';

import { UserModel } from '@models/response/user-model.model';

import { HotToastService } from '@ngxpert/hot-toast';
import { AuthService } from '@shared/services/auth.service';
import { UserService } from '@shared/services/user.service';
import { ApiHttpService } from '@shared/services/api-http.service';
import { ToasterMessageConstants } from '@constants/toaster-message.constant';

@Injectable({
  providedIn: 'root',
})
export class ApplicationResolver implements Resolve<any> {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private toast: HotToastService,
    private apiHttpService: ApiHttpService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<UserModel> {
    const payload = this.authService.decodeAccessToken();
    if (!payload || !payload.exp) return EMPTY;
    return this.apiHttpService.getUserById(payload?.sub).pipe(
      take(1),
      filter(res => !!res),
      tap((res: UserModel) => {
        this.userService.setUserDetails(res);
      }),
      catchError(() => {
        this.toast.error(ToasterMessageConstants.GENERAL_ERROR);
        return EMPTY;
      })
    );
  }
}
