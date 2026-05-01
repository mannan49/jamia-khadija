import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing.module';

import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ForgotOtpComponent } from './forgot-otp/forgot-otp.component';
import { SignupOtpComponent } from './signup-otp/signup-otp.component';
import { SetPasswordComponent } from './set-password/set-password.component';
import { ForgotEmailComponent } from './forgot-email/forgot-email.component';
import { InputComponent } from "../../shared/components/input/input.component";
import { ButtonComponent } from "../../shared/components/button/button.component";
import { ValidateControlDirective } from '@shared/directives/validate-control.directive';
import { OnlyNumberInputDirective } from '@shared/directives/only-number-input.directive';
import { ErrorMessageComponent } from "../../shared/components/error-message/error-message.component";


@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    SignupComponent,
    ForgotOtpComponent,
    SignupOtpComponent,
    SetPasswordComponent,
    ForgotEmailComponent
  ],
  imports: [
    CommonModule,
    InputComponent,
    ButtonComponent,
    AuthRoutingModule,
    ReactiveFormsModule,
    ErrorMessageComponent,
    OnlyNumberInputDirective,
    ValidateControlDirective,
]
})
export class AuthModule { }
