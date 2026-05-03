import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { SettingsComponent } from './settings.component';
import { InputComponent } from '@shared/components/input/input.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';

import { SettingsRoutingModule } from './settings-routing.module';


@NgModule({
  declarations: [
    SettingsComponent,
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    ButtonComponent,
    InputComponent,
    ReactiveFormsModule
  ]
})
export class SettingsModule { }
