import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LibraryRecordContainerComponent } from './components/library-record-container/library-record-container.component';
import { LibraryRecordFormComponent } from './components/library-record-form/library-record-form.component';

const routes: Routes = [
  {
    path: String.Empty,
    component: LibraryRecordContainerComponent,
  },
  {
    path: 'form/:id',
    component: LibraryRecordFormComponent,
  },
  {
    path: 'form',
    component: LibraryRecordFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LibraryRecordsRoutingModule {}
