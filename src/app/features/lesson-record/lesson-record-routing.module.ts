import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LessonFormComponent } from './components/lesson-form/lesson-form.component';

const routes: Routes = [
  {
    path: String.Empty,
    component: LessonFormComponent,
  },
  {
    path: 'form/:id',
    component: LessonFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LessonRecordRoutingModule {}
