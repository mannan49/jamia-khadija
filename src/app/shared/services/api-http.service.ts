import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { ApiUrlService } from './api-url.service';

import { Student } from '@models/entities/student.model';
import { UserModel } from '@models/response/user-model.model';
import { Attendance } from '@models/entities/attendance.model';
import { LibraryBook } from '@models/entities/library-book.model';
import { AuthResponse } from '@models/response/auth-response.model';
import { LessonRecord } from '@models/entities/lesson-record.model';
import { StudentFilter } from '@models/payload/student-filter.model';
import { PagedResponse } from '@models/response/paged-response.model';
import { LibraryRecord } from '@models/entities/library-record.model';
import { ActionResponse } from '@models/response/action-response.model';
import { AttendanceFilter } from '@models/payload/attendance-filter.model';
import { LibraryBookFilter } from '@models/payload/library-book-filter.model';
import { LessonRecordFilter } from '@models/payload/lesson-record-filter.model';
import { LibraryRecordFilter } from '@models/payload/library-record-filter.model';
import { UploadPreSignedUrlResponse } from '@models/response/upload-pre-signed-url-response.model';
import { AttendanceBatchPayload, AttendanceEntryPayload } from '@models/payload/attendance-entry.model';

@Injectable({
  providedIn: 'root',
})
export class ApiHttpService {
  constructor(private httpClient: HttpClient) {}

  //#region Auth
  login(email: string, password: string): Observable<AuthResponse> {
    return this.httpClient.get<AuthResponse>(ApiUrlService.loginUrl(email, password), {
      withCredentials: true,
    });
  }

  logout(): Observable<any> {
    return this.httpClient.get<any>(ApiUrlService.logoutUrl(), { withCredentials: true });
  }

  refreshToken(): Observable<AuthResponse> {
    return this.httpClient.get<AuthResponse>(ApiUrlService.refreshTokenUrl(), {
      withCredentials: true,
    });
  }

  resetPassword(currentPassword: string, newPassword: string): Observable<string> {
    return this.httpClient.get<string>(ApiUrlService.resetPasswordUrl(currentPassword, newPassword));
  }

  //#endregion;

  getUserById(id: string): Observable<UserModel> {
    return this.httpClient.get<UserModel>(ApiUrlService.getUserByIdUrl(id));
  }

  filterStudents(filter: StudentFilter): Observable<PagedResponse<Student>> {
    return this.httpClient.post<PagedResponse<Student>>(ApiUrlService.filterStudentsUrl(), filter);
  }

  addStudent(student: Student): Observable<ActionResponse> {
    return this.httpClient.post<ActionResponse>(ApiUrlService.addStudentUrl(), student);
  }

  updateStudent(id: string, student: Student): Observable<ActionResponse> {
    return this.httpClient.put<ActionResponse>(ApiUrlService.studentByIdUrl(id), student);
  }

  deleteStudent(id: string): Observable<ActionResponse> {
    return this.httpClient.delete<ActionResponse>(ApiUrlService.studentByIdUrl(id));
  }

  getStudentById(id: string): Observable<Student> {
    return this.httpClient.get<Student>(ApiUrlService.studentByIdUrl(id));
  }

  addLessonRecord(record: any): Observable<ActionResponse> {
    return this.httpClient.post<ActionResponse>(ApiUrlService.addLessonRecordUrl(), record);
  }

  updateLessonRecord(id: string, record: LessonRecord): Observable<ActionResponse> {
    return this.httpClient.put<ActionResponse>(ApiUrlService.lessonRecordByIdUrl(id), record);
  }

  deleteLessonRecord(id: string): Observable<ActionResponse> {
    return this.httpClient.delete<ActionResponse>(ApiUrlService.lessonRecordByIdUrl(id));
  }

  getLessonRecordById(id: string): Observable<LessonRecord> {
    return this.httpClient.get<LessonRecord>(ApiUrlService.lessonRecordByIdUrl(id));
  }

  filterLessonRecords(filter: LessonRecordFilter): Observable<PagedResponse<LessonRecord>> {
    return this.httpClient.post<PagedResponse<LessonRecord>>(ApiUrlService.filterLessonRecordsUrl(), filter);
  }

  //#region LibraryBook

  getLibraryBooksByFilter(filter: LibraryBookFilter): Observable<PagedResponse<LibraryBook>> {
    return this.httpClient.post<PagedResponse<LibraryBook>>(ApiUrlService.getLibraryBooksByFilterUrl(), filter);
  }

  addLibraryBook(book: LibraryBook): Observable<ActionResponse> {
    return this.httpClient.post<ActionResponse>(ApiUrlService.addLibraryBookUrl(), book);
  }

  updateLibraryBook(id: string, book: LibraryBook): Observable<ActionResponse> {
    return this.httpClient.put<ActionResponse>(ApiUrlService.libraryBookByIdUrl(id), book);
  }

  deleteLibraryBook(id: string): Observable<ActionResponse> {
    return this.httpClient.delete<ActionResponse>(ApiUrlService.libraryBookByIdUrl(id));
  }

  // #endregion;

  //#region LibraryRecord

  getLibraryRecordsByFilter(filter: LibraryRecordFilter): Observable<PagedResponse<LibraryRecord>> {
    return this.httpClient.post<PagedResponse<LibraryRecord>>(ApiUrlService.getLibraryRecordsByFilterUrl(), filter);
  }

  addLibraryRecord(record: LibraryRecord): Observable<ActionResponse> {
    return this.httpClient.post<ActionResponse>(ApiUrlService.addLibraryRecordUrl(), record);
  }

  updateLibraryRecord(id: string, record: LibraryRecord): Observable<ActionResponse> {
    return this.httpClient.put<ActionResponse>(ApiUrlService.libraryRecordByIdUrl(id), record);
  }

  deleteLibraryRecord(id: string): Observable<ActionResponse> {
    return this.httpClient.delete<ActionResponse>(ApiUrlService.libraryRecordByIdUrl(id));
  }

  generatePreSignedUrl(fileType: string): Observable<UploadPreSignedUrlResponse> {
    return this.httpClient.get<UploadPreSignedUrlResponse>(ApiUrlService.generatePreSignedUrl(fileType));
  }

  // #endregion;

  //#region Attendance

  addAttendanceBatch(model: AttendanceBatchPayload): Observable<ActionResponse> {
    return this.httpClient.post<ActionResponse>(ApiUrlService.addAttendanceBatchUrl(), model);
  }

  filterAttendance(filter: AttendanceFilter): Observable<PagedResponse<Attendance>> {
    return this.httpClient.post<PagedResponse<Attendance>>(ApiUrlService.filterAttendanceUrl(), filter);
  }

  updateAttendance(id: string, model: AttendanceEntryPayload): Observable<ActionResponse> {
    return this.httpClient.put<ActionResponse>(ApiUrlService.attendanceByIdUrl(id), model);
  }

  deleteAttendance(id: string): Observable<ActionResponse> {
    return this.httpClient.delete<ActionResponse>(ApiUrlService.attendanceByIdUrl(id));
  }

  getAttendanceByStudentId(studentId: string, dateFrom?: string, dateTo?: string): Observable<Attendance[]> {
    let url = ApiUrlService.attendanceByStudentIdUrl(studentId);
    const params: string[] = [];
    if (dateFrom) params.push(`dateFrom=${dateFrom}`);
    if (dateTo) params.push(`dateTo=${dateTo}`);
    if (params.length) url += '?' + params.join('&');
    return this.httpClient.get<Attendance[]>(url);
  }

  //#endregion

  uploadFileToS3(url: string, file: File): Observable<any> {
    return this.httpClient.put(url, file, {
      reportProgress: true,
      observe: 'events',
    });
  }
}
