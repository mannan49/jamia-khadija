import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { take, filter, tap, catchError, EMPTY, finalize } from 'rxjs';

import { customEmailValidator } from '@shared/validators/customEmailValidator';

import { ApiHttpService } from '@shared/services/api-http.service';

@Component({
  selector: 'app-forgot-email',
  standalone: false,
  templateUrl: './forgot-email.component.html',
  styleUrl: './forgot-email.component.css',
})
export class ForgotEmailComponent {
  loading = false;
  forgotEmailForm: FormGroup;

  constructor(private router: Router, private formBuilder: FormBuilder, private apiHttpService: ApiHttpService) {}

  ngOnInit() {
    this.initializeForm();
  }
  initializeForm() {
    this.forgotEmailForm = this.formBuilder.group({
      email: [String.Empty, [Validators.required, customEmailValidator()]],
    });
  }

  onSubmitForm() {
    this.loading = true;
    this.sendForgotPasswordOtp(this.forgotEmailForm.get('email')?.value);
  }

  sendForgotPasswordOtp(email: string) {
    // this.apiHttpService
    //   .requestForgotPasswordOtp(email)
    //   .pipe(
    //     take(1),
    //     filter(res => !!res),
    //     tap(res => {
    //       this.router.navigate(['/auth/forgot-otp'], {state: {email: this.forgotEmailForm.get('email')?.value}});
    //       window.alert(res?.message);
    //     }),
    //     catchError(err => {
    //       const { error } = err;
    //       window.alert(error?.message);
    //       return EMPTY;
    //     }),
    //     finalize(() => (this.loading = false))
    //   )
    //   .subscribe();
  }

  onLoginButtonClick() {
    this.router.navigate(['/auth/login']);
  }
}
