import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { take, filter, tap, catchError, EMPTY, finalize } from 'rxjs';

import { ApiHttpService } from '@shared/services/api-http.service';

@Component({
  selector: 'app-forgot-otp',
  standalone: false,
  templateUrl: './forgot-otp.component.html',
  styleUrl: './forgot-otp.component.css'
})
export class ForgotOtpComponent {

  otpLength = 6;
  loading = false;
  resendTimer = 60;
  timerInterval: any;
  forgotOtpForm: FormGroup;
  email = String.Empty;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private apiHttpService: ApiHttpService
  ) {}

  ngOnInit() {
    this.setUserEmail();
    this.initializeforgotOtpForm();
    this.startResendTimer();
  }

  setUserEmail(){
    const navigation = this.router.getCurrentNavigation();
    this.email = navigation?.extras?.state?.['email'] || window.history.state?.email;
    if (!this.email) {
      this.router.navigate(['/auth/forgot-email']);
      return;
    }
  }

  initializeforgotOtpForm() {
    this.forgotOtpForm = this.formBuilder.group(
      Object.fromEntries(
        Array.from({ length: this.otpLength }, (_, i) => [`otp${i}`, [String.Empty, [Validators.required, Validators.pattern(/^\d$/)]]])
      )
    );
  }

  get otpControls() {
    return Object.keys(this.forgotOtpForm.controls);
  }

  onSubmitOtp() {
    if (this.forgotOtpForm.invalid) return;

    const otp = this.otpControls.map(key => this.forgotOtpForm.get(key)?.value).join('');
    // const otpPayload = new OtpVerificationPayload();
    // otpPayload.email = this.email;
    // otpPayload.otp = otp;
    // this.loading = true;
    // this.verifyOtp(otpPayload);
  }

  // verifyOtp(otpPayload: OtpVerificationPayload) {
  //   this.apiHttpService
  //     .forgotOtpVerification(otpPayload)
  //     .pipe(
  //       take(1),
  //       filter(res => !!res),
  //       tap((res) => {
  //         this.router.navigate(['/auth/set-password'], { state: {
  //           email: this.email,
  //           secret_key: res?.secret_key 
  //         }})
  //         window.alert(res?.message);
  //       }),
  //       catchError(err => {
  //         const { error } = err;
  //         window.alert(error?.message);
  //         return EMPTY;
  //       }),
  //       finalize(() => (this.loading = false))
  //     )
  //     .subscribe();
  // }

  startResendTimer() {
    this.resendTimer = 60;
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    this.timerInterval = setInterval(() => {
      if (this.resendTimer > 0) {
        this.resendTimer--;
      } else {
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }

  onResendOtpClick() {
    // this.apiHttpService.requestForgotPasswordOtp(this.email).pipe(
    //     take(1),
    //     filter(res => !!res),
    //     tap(res => {
    //       window.alert(res?.message);
    //     }),
    //     catchError(err => {
    //       const { error } = err;
    //       window.alert(error?.message);
    //       return EMPTY;
    //     })
    //   ).subscribe();
  }

}
