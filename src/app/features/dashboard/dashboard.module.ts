import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { DashboardRoutingModule } from './dashboard-routing.module';

import { DashboardComponent } from './dashboard.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    ButtonComponent,
    LoaderComponent,
    ReactiveFormsModule,
    DashboardRoutingModule,
  ],
})
export class DashboardModule {}
