import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CnicPipe } from '@shared/pipes/cnic.pipe';
import { StudentsRoutingModule } from './students-routing.module';

import { InputComponent } from '@shared/components/input/input.component';
import { SelectComponent } from '@shared/components/select/select.component';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { DropdownComponent } from '@shared/components/dropdown/dropdown.component';
import { StudentFormComponent } from './components/student-form/student-form.component';
import { SearchBarComponent } from '@shared/components/search-bar/search-bar.component';
import { StudentsTableComponent } from './components/students-table/students-table.component';
import { DownloadRecordComponent } from './components/download-record/download-record.component';
import { StudentsContainerComponent } from './components/students-container/students-container.component';
import { PaginationActionsComponent } from '@shared/components/pagination-actions/pagination-actions.component';
import { StudentLessonRecordComponent } from './components/student-lesson-record/student-lesson-record.component';
import { DigitsOnlyDirective } from '@shared/directives/digits-only.directive';

@NgModule({
  declarations: [
    StudentFormComponent,
    StudentsTableComponent,
    StudentsContainerComponent,
    StudentLessonRecordComponent,
    DownloadRecordComponent,
  ],
  imports: [
    CnicPipe,
    FormsModule,
    CommonModule,
    InputComponent,
    SelectComponent,
    LoaderComponent,
    ButtonComponent,
    DropdownComponent,
    SearchBarComponent,
    DigitsOnlyDirective,
    ReactiveFormsModule,
    StudentsRoutingModule,
    PaginationActionsComponent,
  ],
})
export class StudentsModule {}
