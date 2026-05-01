import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { catchError, EMPTY, filter, finalize, take, tap } from 'rxjs';

import { ApiHttpService } from '@shared/services/api-http.service';

@Component({
  selector: 'app-signup-otp',
  standalone: false,
  templateUrl: './signup-otp.component.html',
  styleUrl: './signup-otp.component.css',
})
export class SignupOtpComponent {
  otpLength = 6;
  loading = false;
  resendTimer = 60;
  timerInterval: any;
  otpForm: FormGroup;
  email = String.Empty;

  constructor(private router: Router, private formBuilder: FormBuilder, private apiHttpService: ApiHttpService) {}

  ngOnInit() {
    this.setUserEmail();
    this.initializeOtpForm();
    this.startResendTimer();
  }

  setUserEmail(){
    const navigation = this.router.getCurrentNavigation();
    this.email = navigation?.extras?.state?.['email'] || window.history.state?.email;
    if (!this.email) {
      this.router.navigate(['/auth/signup']);
      return;
    }
  }

  initializeOtpForm() {
    this.otpForm = this.formBuilder.group(
      Object.fromEntries(
        Array.from({ length: this.otpLength }, (_, i) => [`otp${i}`, [String.Empty, [Validators.required, Validators.pattern(/^\d$/)]]])
      )
    );
  }

  get otpControls() {
    return Object.keys(this.otpForm.controls);
  }

  onSubmitOtp() {
    if (this.otpForm.invalid) return;

    const otp = this.otpControls.map(key => this.otpForm.get(key)?.value).join('');
    // const otpPayload = new OtpVerificationPayload();
    // otpPayload.email = this.email;
    // otpPayload.otp = otp;
    // this.loading = true;
    // this.verifyOtp(otpPayload);
  }

  // verifyOtp(otpPayload: OtpVerificationPayload) {
  //   this.apiHttpService
  //     .signupOtpVerification(otpPayload)
  //     .pipe(
  //       take(1),
  //       filter(res => !!res),
  //       tap((res) => {
  //         localStorage.setItem("access_token", res?.token);
  //         this.router.navigate(['/'])
  //          window.alert(res?.message);
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
    // this.apiHttpService.resendSignupOtp(this.email).pipe(
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
