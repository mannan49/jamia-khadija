import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { catchError, EMPTY, filter, finalize, take, tap } from 'rxjs';

import { Student } from '@models/entities/student.model';
import { StudentFilter } from '@models/payload/student-filter.model';
import { PagedResponse } from '@models/response/paged-response.model';
import { ActionResponse } from '@models/response/action-response.model';
import { AttendanceBatchPayload, AttendanceEntryPayload } from '@models/payload/attendance-entry.model';

import { AttendanceStatus } from '@enums/attendace-status.enum';
import { ToasterMessageConstants } from '@constants/toaster-message.constant';

import { HotToastService } from '@ngxpert/hot-toast';
import { ApiHttpService } from '@shared/services/api-http.service';

@Component({
  selector: 'app-attendance-form',
  standalone: false,
  templateUrl: './attendance-form.component.html',
})
export class AttendanceFormComponent implements OnInit {
  loading = false;
  studentsLoading = false;
  saving = false;
  selectedDate: string;
  selectedClass = 'حفظ';
  attendanceEntries: AttendanceEntryPayload[] = [];

  statusOptions: { value: string; label: string; btnClass: string }[] = [
    { value: 'Present', label: 'حاضر', btnClass: 'bg-green-500 text-white' },
    { value: 'Absent', label: 'غیر حاضر', btnClass: 'bg-red-500 text-white' },
    { value: 'Leave', label: 'رخصت', btnClass: 'bg-yellow-400 text-white' },
  ];

  constructor(
    private router: Router,
    private toast: HotToastService,
    private apiHttpService: ApiHttpService
  ) {}

  ngOnInit() {
    this.selectedDate = new Date().toISOString().split('T')[0];
    this.loadStudents()
  }

  loadStudents() {
    this.studentsLoading = true;
    const studentFilter = new StudentFilter();
    studentFilter.IsActive = true;
    studentFilter.Limit = 1000;

    this.apiHttpService
      .filterStudents(studentFilter)
      .pipe(
        take(1),
        filter(res => !!res),
        tap((res: PagedResponse<Student>) => {
          // Build attendance entry list — default everyone to Present
          this.attendanceEntries = res.Items.map(s => ({
            StudentId: s?.Id,
            StudentName: s?.Name,
            Class: s?.Class,
            Department: s?.Department,
            Status: AttendanceStatus.PRESENT,
            LeaveReason: String.Empty,
          }));
        }),
        catchError(() => EMPTY),
        finalize(() => {
          this.studentsLoading = false;
        })
      )
      .subscribe();
  }

  setStatus(entry: AttendanceEntryPayload, status: string) {
    entry.Status = status;
    if (status !== 'Leave') entry.LeaveReason = String.Empty;
  }

  getStatusBtnClass(entry: AttendanceEntryPayload, status: string): string {
    if (entry.Status === status) {
      return this.statusOptions.find(s => s.value === status)?.btnClass ?? String.Empty;
    }
    return 'bg-gray-100 text-gray-500';
  }

  markAll(status: string) {
    this.attendanceEntries.forEach(e => {
      e.Status = status;
      if (status !== 'Leave') e.LeaveReason = String.Empty;
    });
  }

  get presentCount(): number {
    return this.attendanceEntries.filter(e => e.Status === AttendanceStatus.PRESENT).length;
  }

  get absentCount(): number {
    return this.attendanceEntries.filter(e => e.Status === AttendanceStatus.ABSENT).length;
  }

  get leaveCount(): number {
    return this.attendanceEntries.filter(e => e.Status === AttendanceStatus.LEAVE).length;
  }

  onSaveAttendance() {
    if (!this.selectedDate) {
      this.toast.warning('تاریخ درج کریں');
      return;
    }
    if (!this.attendanceEntries.length) {
      this.toast.warning('پہلے جماعت منتخب کریں');
      return;
    }

    this.saving = true;
    const payload: AttendanceBatchPayload = {
      Date: this.selectedDate,
      Entries: this.attendanceEntries,
    };

    this.apiHttpService
      .addAttendanceBatch(payload)
      .pipe(
        take(1),
        tap((res: ActionResponse) => {
          this.toast.success(res?.Message);
          this.router.navigate(['attendance']);
        }),
        catchError(() => {
          this.toast.error(ToasterMessageConstants.GENERAL_ERROR);
          return EMPTY;
        }),
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe();
  }
}
