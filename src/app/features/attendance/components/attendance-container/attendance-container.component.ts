import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { catchError, EMPTY, filter, finalize, take, tap } from 'rxjs';

import { Select } from '@models/shared/select.model';
import { Attendance } from '@models/entities/attendance.model';
import { AttendanceFilter } from '@models/payload/attendance-filter.model';
import { PagedResponse } from '@models/response/paged-response.model';
import { ActionResponse } from '@models/response/action-response.model';

import { HotToastService } from '@ngxpert/hot-toast';
import { ApiHttpService } from '@shared/services/api-http.service';

@Component({
  selector: 'app-attendance-container',
  standalone: false,
  templateUrl: './attendance-container.component.html',
})
export class AttendanceContainerComponent implements OnInit {
  loading = false;
  selectedDate = String.Empty;
  selectedClass = String.Empty;
  selectedStatus = String.Empty;
  pagedAttendance: PagedResponse<Attendance>;

  classesList: Select[] = [
    { Value: 'پارہ 1', Display: 'پارہ ۱' },
    { Value: 'پارہ 2', Display: 'پارہ ۲' },
    { Value: 'پارہ 3', Display: 'پارہ ۳' },
    { Value: 'ناظرہ', Display: 'ناظرہ' },
    { Value: 'حفظ', Display: 'حفظ' },
  ];

  statusList: Select[] = [
    { Value: 'Present', Display: 'حاضر' },
    { Value: 'Absent', Display: 'غیر حاضر' },
    { Value: 'Leave', Display: 'رخصت' },
  ];

  constructor(
    private router: Router,
    private toast: HotToastService,
    private apiHttpService: ApiHttpService
  ) {}

  ngOnInit() {
    // Default to today's date
    this.selectedDate = new Date().toISOString().split('T')[0];
    this.fetchAttendance();
  }

  fetchAttendance() {
    this.loading = true;
    const attendanceFilter = this.constructFilter();
    this.getAttendanceByFilter(attendanceFilter);
  }

  constructFilter(): AttendanceFilter {
    const f = new AttendanceFilter();
    f.Date = this.selectedDate;
    f.Class = this.selectedClass;
    f.Status = this.selectedStatus;
    return f;
  }

  getAttendanceByFilter(attendanceFilter: AttendanceFilter) {
    this.apiHttpService
      .filterAttendance(attendanceFilter)
      .pipe(
        take(1),
        filter(res => !!res),
        tap((res: PagedResponse<Attendance>) => {
          this.pagedAttendance = res;
        }),
        catchError(() => EMPTY),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe();
  }

  handlePageChange(index: number) {
    const f = this.constructFilter();
    f.PageIndex = index;
    this.loading = true;
    this.getAttendanceByFilter(f);
  }

  handleDateChange(date: string) {
    this.selectedDate = date;
    this.fetchAttendance();
  }

  handleClassSelectionChange(cls: string) {
    this.selectedClass = cls;
    this.fetchAttendance();
  }

  handleStatusSelectionChange(status: string) {
    this.selectedStatus = status;
    this.fetchAttendance();
  }

  onMarkAttendanceClick() {
    this.router.navigate(['attendance/form']);
  }

  handleDeleteButtonClick(id: string) {
    this.apiHttpService
      .deleteAttendance(id)
      .pipe(
        take(1),
        filter(res => !!res),
        tap((res: ActionResponse) => {
          this.toast.success(res?.Message);
          this.fetchAttendance();
        }),
        catchError(() => EMPTY)
      )
      .subscribe();
  }

  getStatusUrdu(status: string): string {
    const map: Record<string, string> = {
      Present: 'حاضر',
      Absent: 'غیر حاضر',
      Leave: 'رخصت',
    };
    return map[status] ?? status;
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      Present: 'bg-green-100 text-green-700',
      Absent: 'bg-red-100 text-red-700',
      Leave: 'bg-yellow-100 text-yellow-700',
    };
    return map[status] ?? 'bg-gray-100 text-gray-600';
  }
}
