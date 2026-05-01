import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { LibraryRecordsRoutingModule } from './library-records-routing.module';

import { InputComponent } from '@shared/components/input/input.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { SelectComponent } from '@shared/components/select/select.component';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { DropdownComponent } from '@shared/components/dropdown/dropdown.component';
import { SearchBarComponent } from '@shared/components/search-bar/search-bar.component';
import { PaginationActionsComponent } from '@shared/components/pagination-actions/pagination-actions.component';

import { LibraryRecordContainerComponent } from './components/library-record-container/library-record-container.component';
import { LibraryRecordTableComponent } from './components/library-record-table/library-record-table.component';
import { LibraryRecordFormComponent } from './components/library-record-form/library-record-form.component';

@NgModule({
  declarations: [
    LibraryRecordContainerComponent,
    LibraryRecordTableComponent,
    LibraryRecordFormComponent,
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
    LibraryRecordsRoutingModule,
    PaginationActionsComponent,
  ],
})
export class LibraryRecordsModule {}
