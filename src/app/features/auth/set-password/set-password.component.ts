import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { catchError, EMPTY, filter, finalize, take, tap } from 'rxjs';

import { confirmPasswordValidator } from '@shared/validators/confirmPasswordValidator';
import { passwordStrengthValidator } from '@shared/validators/passwordStrengthValidator';

import { ApiHttpService } from '@shared/services/api-http.service';

@Component({
  selector: 'app-set-password',
  standalone: false,
  templateUrl: './set-password.component.html',
  styleUrl: './set-password.component.css',
})

export class SetPasswordComponent {
  loading = false;
  email = String.Empty;
  secretKey = String.Empty;
  setPasswordForm: FormGroup;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private apiHttpService: ApiHttpService
  ) {}

  ngOnInit() {
    this.setUserEmailAndSecretKey();
    this.initializeForm();
  }

  initializeForm() {
    this.setPasswordForm = this.formBuilder.group({
      password: [String.Empty, [Validators.required, passwordStrengthValidator()]],
      confirmPassword: [String.Empty, [Validators.required, confirmPasswordValidator()]],
    });
  }

  setUserEmailAndSecretKey() {
    const navigation = this.router.getCurrentNavigation();
    this.email = navigation?.extras?.state?.['email'] || window.history.state?.email;
    this.secretKey = navigation?.extras?.state?.['secret_key'] || window.history.state?.secret_key;
    if (!this.email || !this.secretKey) {
      this.router.navigate(['/auth/forgot-email']);
      return;
    }
  }

  onSubmitForm() {
    this.loading = true;
    // const payload = new ResetPasswordPayload();
    // payload.email = this.email;
    // payload.secret_key = this.secretKey;
    // payload.newPassword = this.setPasswordForm.get('password')?.value;
    // this.resetPassword(payload);
  }

  // resetPassword(payload: ResetPasswordPayload) {
  //   this.apiHttpService
  //     .resetPassword(payload)
  //     .pipe(
  //       take(1),
  //       filter(res => !!res),
  //       tap(res => {
  //         window.alert(res?.message);
  //         this.router.navigate(['/auth/login']);
  //       }),
  //       catchError(() => {
  //         return EMPTY;
  //       }),
  //       finalize(() => (this.loading = false))
  //     )
  //     .subscribe();
  // }
}
