import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { take, tap, catchError, EMPTY } from 'rxjs';
import { HotToastService } from '@ngxpert/hot-toast';

import { ApiHttpService } from '@shared/services/api-http.service';
import { PasswordMismatchValidator } from '@shared/validators/passwordMatchValidator';
import { differentPasswordValidator } from '@shared/validators/differentPasswordValidator';

@Component({
  selector: 'app-change-password',
  standalone: false,
  templateUrl: './change-password.component.html',
})
export class ChangePasswordComponent {
  changePasswordForm: FormGroup;

  constructor(
    private formBuilder:FormBuilder,
    private toast: HotToastService,
    private apiHttpService:ApiHttpService,
    private router:Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.initializeForm();
  }
  
  initializeForm() {
    this.changePasswordForm = this.formBuilder.group({
      currentPassword: [String.Empty, [Validators.required]],
      newPassword: [String.Empty, [Validators.required,differentPasswordValidator('currentPassword')]],
      confirmPassword: [String.Empty, [Validators.required, PasswordMismatchValidator('newPassword')]],
    });
    this.changePasswordForm.get('currentPassword')?.valueChanges.subscribe(() => {
      this.changePasswordForm.get('newPassword')?.updateValueAndValidity();
    });
    
    this.changePasswordForm.get('newPassword')?.valueChanges.subscribe(() => {
      this.changePasswordForm.get('confirmPassword')?.updateValueAndValidity();
    });
  }
  onSubmitForm() {
    if(!this.changePasswordForm.valid) return;
    const { currentPassword, newPassword } = this.changePasswordForm.value;
    this.changePassword(currentPassword, newPassword);
  }

  changePassword(currentPassword: string, newPassword: string) {
    this.apiHttpService
      .resetPassword(currentPassword, newPassword)
      .pipe(
        take(1),
        tap(() => {
          this.toast.success('Password Changed Successfully!');
          this.router.navigate(['../'], { relativeTo: this.route });
        }),
        catchError(err => {
          const { error } = err;
          this.toast.error(error?.message);
          return EMPTY;
        }),
      )
      .subscribe();
  }
}
