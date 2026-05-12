import { Select } from '@models/shared/select.model';

export class DashboardAnalytics {
  TotalStudents: number;
  TotalHifzStudents: number;
  TotalDarsENizamiStudents: number;
  TotalBooks: number;
  BooksIssued: number;
  BooksByCategory: Select[];
  TotalAttendanceRecords: number;
  TotalLessonRecords: number;
}
