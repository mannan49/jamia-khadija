import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { catchError, EMPTY, filter, finalize, take, tap } from 'rxjs';

import { customEmailValidator } from '@shared/validators/customEmailValidator';

import { HotToastService } from '@ngxpert/hot-toast';
import { AuthService } from '@shared/services/auth.service';
import { ApiHttpService } from '@shared/services/api-http.service';
import { ToasterMessageConstants } from '@constants/toaster-message.constant';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loading = false;
  loginForm: FormGroup;

  constructor(
    private router: Router,
    private toast: HotToastService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private apiHttpService: ApiHttpService
  ) {}

  ngOnInit() {
    this.initializeForm();
  }
  initializeForm() {
    this.loginForm = this.formBuilder.group({
      email: ["demo.user@dareecha.com", [Validators.required, customEmailValidator()]],
      password: ["Pakistan@123", [Validators.required]],
    });
  }

  onSubmitForm() {
    this.loading = true;
    const { email, password } = this.loginForm.value;
    this.requestLogin(email, password);
  }

  requestLogin(email: string, password: string) {
    this.apiHttpService
      .login(email, password)
      .pipe(
        take(1),
        filter(res => !!res),
        tap(res => {
          this.authService.setAccessToken(res?.AccessToken);
          this.authService.startTokenRefreshTimer();
          this.router.navigate(['/']);
        }),
        catchError(err => {
          const { error } = err;
          this.toast.error(error?.message || ToasterMessageConstants.GENERAL_ERROR);
          return EMPTY;
        }),
        finalize(() => (this.loading = false))
      )
      .subscribe();
  }

  onSignupButtonClick() {
    this.router.navigate(['/auth/signup']);
  }
}
