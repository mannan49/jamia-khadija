import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { LibraryBooksRoutingModule } from './library-books-routing.module';

import { InputComponent } from '@shared/components/input/input.component';
import { SelectComponent } from '@shared/components/select/select.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { DropdownComponent } from '@shared/components/dropdown/dropdown.component';
import { SearchBarComponent } from '@shared/components/search-bar/search-bar.component';
import { ProgressBarComponent } from '@shared/components/progress-bar/progress-bar.component';
import { IconDoneSvgComponent } from '@shared/components/svgs/icon-done-svg/icon-done-svg.component';
import { LibraryBookFormComponent } from './components/library-book-form/library-book-form.component';
import { LibraryBookTableComponent } from './components/library-book-table/library-book-table.component';
import { IconDeleteSvgComponent } from '@shared/components/svgs/icon-delete-svg/icon-delete-svg.component';
import { IconUploadSvgComponent } from '@shared/components/svgs/icon-upload-svg/icon-upload-svg.component';
import { PaginationActionsComponent } from '@shared/components/pagination-actions/pagination-actions.component';
import { LibraryBookContainerComponent } from './components/library-book-container/library-book-container.component';
import { FilesUploadContainerComponent } from '@shared/components/files-upload-container/files-upload-container.component';

@NgModule({
  declarations: [
    LibraryBookContainerComponent,
    LibraryBookTableComponent,
    LibraryBookFormComponent,
  ],
  imports: [
    CommonModule,
    InputComponent,
    LoaderComponent,
    SelectComponent,
    ButtonComponent,
    DropdownComponent,
    SearchBarComponent,
    ReactiveFormsModule,
    ProgressBarComponent,
    IconDoneSvgComponent,
    IconUploadSvgComponent,
    IconDeleteSvgComponent,
    LibraryBooksRoutingModule,
    PaginationActionsComponent,
    FilesUploadContainerComponent,
  ],
})
export class LibraryBooksModule {}
