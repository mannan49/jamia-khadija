import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { LessonRecordRoutingModule } from './lesson-record-routing.module';

import { InputComponent } from '@shared/components/input/input.component';
import { SelectComponent } from '@shared/components/select/select.component';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { ButtonComponent } from '@shared/components/button/button.component';

import { LessonFormComponent } from './components/lesson-form/lesson-form.component';

@NgModule({
  declarations: [
    LessonFormComponent,
  ],
  imports: [
    CommonModule,
    InputComponent,
    SelectComponent,
    LoaderComponent,
    ButtonComponent,
    ReactiveFormsModule,
    LessonRecordRoutingModule,
  ],
})
export class LessonRecordModule {}
