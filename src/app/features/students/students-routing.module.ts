import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StudentFormComponent } from './components/student-form/student-form.component';
import { StudentsContainerComponent } from './components/students-container/students-container.component';
import { StudentLessonRecordComponent } from './components/student-lesson-record/student-lesson-record.component';

const routes: Routes = [
  {
    path: String.Empty,
    component: StudentsContainerComponent,
  },
  {
    path: 'form/:id',
    component: StudentFormComponent,
  },
  {
    path: 'form',
    component: StudentFormComponent,
  },
  {
    path: 'lesson-record/:id',
    component: StudentLessonRecordComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudentsRoutingModule {}
