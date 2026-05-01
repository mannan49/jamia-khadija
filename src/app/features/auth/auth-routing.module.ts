import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { SignupOtpComponent } from './signup-otp/signup-otp.component';
import { ForgotOtpComponent } from './forgot-otp/forgot-otp.component';
import { SetPasswordComponent } from './set-password/set-password.component';
import { ForgotEmailComponent } from './forgot-email/forgot-email.component';

const routes: Routes = [
  {
    path: String.Empty,
    component: AuthComponent,
    children: [
      {
        path: String.Empty,
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'signup',
        component: SignupComponent,
      },
      {
        path: 'otp',
        component: SignupOtpComponent,
      },
      {
        path: 'signup',
        component: SignupComponent,
      },
      {
        path: 'forgot-otp',
        component: ForgotOtpComponent,
      },
      {
        path: 'forgot-email',
        component: ForgotEmailComponent,
      },
      {
        path: 'set-password',
        component: SetPasswordComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
