import { Pipe, PipeTransform } from '@angular/core';
import { Attendance } from '@models/entities/attendance.model';

@Pipe({
  name: 'attendanceCount',
  standalone: true,
})
export class AttendanceCountPipe implements PipeTransform {
  transform(items: Attendance[] | null | undefined, status: string): number {
    if (!items || !status) return 0;

    return items.filter(item => item?.Status === status).length;
  }
}
