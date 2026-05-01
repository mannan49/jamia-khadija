import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { catchError, EMPTY, finalize, take, tap } from 'rxjs';

import { Attendance } from '@models/entities/attendance.model';

import { ApiHttpService } from '@shared/services/api-http.service';

@Component({
  selector: 'app-student-attendance',
  standalone: false,
  templateUrl: './student-attendance.component.html',
})
export class StudentAttendanceComponent implements OnInit {
  loading = false;
  studentId = String.Empty;
  studentName = String.Empty;
  attendanceRecords: Attendance[] = [];
  dateFrom = String.Empty;
  dateTo = String.Empty;

  get presentCount(): number {
    return this.attendanceRecords.filter(r => r.Status === 'Present').length;
  }
  get absentCount(): number {
    return this.attendanceRecords.filter(r => r.Status === 'Absent').length;
  }
  get leaveCount(): number {
    return this.attendanceRecords.filter(r => r.Status === 'Leave').length;
  }
  get attendancePercentage(): number {
    const total = this.attendanceRecords.length;
    return total ? Math.round((this.presentCount / total) * 100) : 0;
  }

  constructor(
    private route: ActivatedRoute,
    private apiHttpService: ApiHttpService
  ) {}

  ngOnInit() {
    this.studentId = this.route.snapshot.paramMap.get('id');
    // Default: last 30 days
    const today = new Date();
    this.dateTo = today.toISOString().split('T')[0];
    this.dateFrom = new Date(today.setDate(today.getDate() - 30)).toISOString().split('T')[0];
    this.fetchAttendance();
  }

  fetchAttendance() {
    this.loading = true;
    this.apiHttpService
      .getAttendanceByStudentId(this.studentId, this.dateFrom, this.dateTo)
      .pipe(
        take(1),
        tap((records: Attendance[]) => {
          this.attendanceRecords = records;
          if (records.length) this.studentName = records[0].StudentName;
        }),
        catchError(() => EMPTY),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe();
  }

  handleDateFromChange(date: string) {
    this.dateFrom = date;
    this.fetchAttendance();
  }

  handleDateToChange(date: string) {
    this.dateTo = date;
    this.fetchAttendance();
  }

  getStatusUrdu(status: string): string {
    const map: Record<string, string> = { Present: 'حاضر', Absent: 'غیر حاضر', Leave: 'رخصت' };
    return map[status] ?? status;
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      Present: 'bg-green-100 text-green-700',
      Absent: 'bg-red-100 text-red-700',
      Leave: 'bg-yellow-100 text-yellow-700',
    };
    return map[status] ?? 'bg-gray-100 text-gray-500';
  }
}
