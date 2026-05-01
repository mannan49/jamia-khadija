import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LibraryBookContainerComponent } from './components/library-book-container/library-book-container.component';
import { LibraryBookFormComponent } from './components/library-book-form/library-book-form.component';

const routes: Routes = [
  {
    path: String.Empty,
    component: LibraryBookContainerComponent,
  },
  {
    path: 'form/:id',
    component: LibraryBookFormComponent,
  },
  {
    path: 'form',
    component: LibraryBookFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LibraryBooksRoutingModule {}
