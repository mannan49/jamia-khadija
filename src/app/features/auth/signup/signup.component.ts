import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { catchError, EMPTY, filter, finalize, take, tap } from 'rxjs';

import { customEmailValidator } from '@shared/validators/customEmailValidator';
import { confirmPasswordValidator } from '@shared/validators/confirmPasswordValidator';
import { passwordStrengthValidator } from '@shared/validators/passwordStrengthValidator';

import { SignupPayload } from '@models/payload/signup-payload.model';

import { ApiHttpService } from '@shared/services/api-http.service';

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  loading = false;
  signupForm: FormGroup;

  constructor(private router: Router, private formBuilder: FormBuilder, private apiHttpService: ApiHttpService) {}

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.signupForm = this.formBuilder.group({
      fullName: [String.Empty, Validators.required],
      email: [String.Empty, [Validators.required, customEmailValidator()]],
      password: [String.Empty, [Validators.required, passwordStrengthValidator()]],
      confirmPassword: [String.Empty, [Validators.required, confirmPasswordValidator()]],
      phoneNumber: [String.Empty, [Validators.required]],
    });
  }

  onSubmitForm() {
    if (this.signupForm.invalid) return;
    this.loading = true;
    const signupPayload = new SignupPayload();
    signupPayload.Email = this.signupForm.get('email')?.value;
    signupPayload.Name = this.signupForm.get('fullName')?.value;
    signupPayload.Password = this.signupForm.get('password')?.value;
    signupPayload.PhoneNumber = this.signupForm.get('phoneNumber')?.value;
    this.signupUser(signupPayload);
  }
  signupUser(payload: SignupPayload) {
    // this.apiHttpService
    //   .signup(payload)
    //   .pipe(
    //     take(1),
    //     filter(res => !!res),
    //     tap(res => {
    //       window.alert(res?.message);
    //       this.router.navigate(['/auth/otp'], {state: {email: this.signupForm.get('email')?.value}});
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
}
