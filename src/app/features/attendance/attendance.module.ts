import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AttendanceRoutingModule } from './attendance-routing.module';
import { AttendanceCountPipe } from '@shared/pipes/attendance-count.pipe';

import { InputComponent } from '@shared/components/input/input.component';
import { SelectComponent } from '@shared/components/select/select.component';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { DropdownComponent } from '@shared/components/dropdown/dropdown.component';
import { SearchBarComponent } from '@shared/components/search-bar/search-bar.component';
import { AttendanceFormComponent } from './components/attendance-form/attendance-form.component';
import { StudentAttendanceComponent } from './components/student-attendance/student-attendance.component';
import { PaginationActionsComponent } from '@shared/components/pagination-actions/pagination-actions.component';
import { AttendanceContainerComponent } from './components/attendance-container/attendance-container.component';

@NgModule({
  declarations: [AttendanceContainerComponent, AttendanceFormComponent, StudentAttendanceComponent],
  imports: [
    FormsModule,
    CommonModule,
    InputComponent,
    SelectComponent,
    LoaderComponent,
    ButtonComponent,
    DropdownComponent,
    SearchBarComponent,
    ReactiveFormsModule,
    AttendanceCountPipe,
    AttendanceRoutingModule,
    PaginationActionsComponent,
  ],
})
export class AttendanceModule {}
