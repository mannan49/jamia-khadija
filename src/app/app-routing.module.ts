import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '@shared/guard/auth.guard';

import { ApplicationResolver } from '@shared/resolvers/application.resolver';

import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    resolve: { user: ApplicationResolver },
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('@features/dashboard/dashboard.module').then(m => m.DashboardModule),
      },
      {
        path: 'students',
        loadChildren: () => import('@features/students/students.module').then(m => m.StudentsModule),
      },
      {
        path: 'lesson-record',
        loadChildren: () => import('@features/lesson-record/lesson-record.module').then(m => m.LessonRecordModule),
      },
      {
        path: 'library-books',
        loadChildren: () => import('./features/library-books/library-books.module').then(m => m.LibraryBooksModule),
      },
      {
        path: 'library-records',
        loadChildren: () => import('./features/library-records/library-records.module').then(m => m.LibraryRecordsModule),
      },
      {
        path: 'attendance',
        loadChildren: () => import('./features/attendance/attendance.module').then(m => m.AttendanceModule),
      },
    ],
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    canActivate: [AuthGuard],
    data: { guestOnly: true },
    loadChildren: () => import('@features/auth/auth.module').then(m => m.AuthModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
