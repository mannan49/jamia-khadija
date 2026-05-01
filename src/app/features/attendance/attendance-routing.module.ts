import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AttendanceFormComponent } from './components/attendance-form/attendance-form.component';
import { StudentAttendanceComponent } from './components/student-attendance/student-attendance.component';
import { AttendanceContainerComponent } from './components/attendance-container/attendance-container.component';

const routes: Routes = [
  {
    path: String.Empty,
    component: AttendanceContainerComponent,
  },
  {
    path: 'form',
    component: AttendanceFormComponent,
  },
  {
    path: 'student/:id',
    component: StudentAttendanceComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AttendanceRoutingModule {}
