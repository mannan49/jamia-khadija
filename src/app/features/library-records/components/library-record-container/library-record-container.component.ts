import { Router } from '@angular/router';
import { Component } from '@angular/core';

import { take, filter, tap, catchError, EMPTY, finalize } from 'rxjs';

import { Select } from '@models/shared/select.model';
import { LibraryRecord } from '@models/entities/library-record.model';
import { LibraryRecordFilter } from '@models/payload/library-record-filter.model';
import { PagedResponse } from '@models/response/paged-response.model';
import { ActionResponse } from '@models/response/action-response.model';

import { HotToastService } from '@ngxpert/hot-toast';
import { ApiHttpService } from '@shared/services/api-http.service';

@Component({
  selector: 'app-library-record-container',
  standalone: false,
  templateUrl: './library-record-container.component.html',
})
export class LibraryRecordContainerComponent {
  loading = false;
  searchedQuery = String.Empty;
  selectedStatus: boolean | null = null;
  pagedLibraryRecords: PagedResponse<LibraryRecord>;

  statusList: Select[] = [
    { Value: 'true', Display: 'جاری' },
    { Value: 'false', Display: 'واپس' },
  ];

  constructor(
    private router: Router,
    private toast: HotToastService,
    private apiHttpService: ApiHttpService
  ) {}

  ngOnInit() {
    this.fetchLibraryRecords();
  }

  fetchLibraryRecords() {
    this.loading = true;
    const recordFilter = this.constructRecordFilter();
    this.getLibraryRecordsByFilter(recordFilter);
  }

  constructRecordFilter(): LibraryRecordFilter {
    const recordFilter = new LibraryRecordFilter();
    recordFilter.Query = this.searchedQuery;
    if (this.selectedStatus !== null) {
      recordFilter.IsBorrowed = this.selectedStatus;
    }
    return recordFilter;
  }

  getLibraryRecordsByFilter(recordFilter: LibraryRecordFilter) {
    this.apiHttpService
      .getLibraryRecordsByFilter(recordFilter)
      .pipe(
        take(1),
        filter(res => !!res),
        tap((res: PagedResponse<LibraryRecord>) => {
          this.pagedLibraryRecords = res;
        }),
        catchError(() => EMPTY),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe();
  }

  handlePageChange(index: number) {
    const recordFilter = this.constructRecordFilter();
    recordFilter.PageIndex = index;
    this.loading = true;
    this.getLibraryRecordsByFilter(recordFilter);
  }

  onAddNewButtonClick() {
    this.router.navigate(['library-records/form']);
  }

  handleStatusSelectionChange(status: string) {
    if (status === String.Empty) {
      this.selectedStatus = null;
    } else {
      this.selectedStatus = status === 'true';
    }
    this.fetchLibraryRecords();
  }

  handleSearchClick(query: string) {
    this.searchedQuery = query;
    this.fetchLibraryRecords();
  }

  handleDeleteButtonClick(recordId: string) {
    this.apiHttpService
      .deleteLibraryRecord(recordId)
      .pipe(
        take(1),
        filter(res => !!res),
        tap((res: ActionResponse) => {
          this.toast.success(res?.Message);
          this.fetchLibraryRecords();
        }),
        catchError(() => EMPTY)
      )
      .subscribe();
  }
}
