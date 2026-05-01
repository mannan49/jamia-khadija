import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiUrlService {
  static apiBaseUrl = environment.apiBaseUrl;

  //#region Auth

  static loginUrl(email: string, password: string): string {
    return `${this.apiBaseUrl}/user/login?email=${email}&password=${password}&role=Admin`;
  }

  static refreshTokenUrl(): string {
    return `${this.apiBaseUrl}/user/refresh-token`;
  }

  static resetPasswordUrl(currentPassword: string, newPassword: string): string {
    return `${this.apiBaseUrl}/user/reset-password?currentPassword=${currentPassword}&newPassword=${newPassword}`;
  }

  static logoutUrl(): string {
    return `${this.apiBaseUrl}/user/logout`;
  }
  // #endregion;

  static getUserByIdUrl(id: string): string {
    return `${this.apiBaseUrl}/user/${id}`;
  }

  static updateProfileUrl(): string {
    return `${this.apiBaseUrl}/user/update-profile`;
  }

  static verifyPasswordUrl(): string {
    return `${this.apiBaseUrl}/user/verify-password`;
  }

  static changePasswordUrl(): string {
    return `${this.apiBaseUrl}/user/change-password`;
  }

  static filterStudentsUrl(): string {
    return `${this.apiBaseUrl}/Student/advance-search`;
  }

  //#region Students

  static addStudentUrl(): string {
    return `${this.apiBaseUrl}/Student`;
  }

  static studentByIdUrl(id: string): string {
    return `${this.apiBaseUrl}/Student/${id}`;
  }

  // #endregion;

  //#region Lesson

  static lessonRecordByIdUrl(id: string): string {
    return `${this.apiBaseUrl}/LessonRecord/${id}`;
  }

  static addLessonRecordUrl(): string {
    return `${this.apiBaseUrl}/LessonRecord`;
  }

  static filterLessonRecordsUrl(): string {
    return `${this.apiBaseUrl}/LessonRecord/advance-search`;

    // #endregion;
  }

  //#region LibraryBook

  static getLibraryBooksByFilterUrl(): string {
    return `${this.apiBaseUrl}/LibraryBook/advance-search`;
  }

  static addLibraryBookUrl(): string {
    return `${this.apiBaseUrl}/LibraryBook`;
  }

  static libraryBookByIdUrl(id: string): string {
    return `${this.apiBaseUrl}/LibraryBook/${id}`;
  }

  // #endregion;

  //#region LibraryRecord

  static getLibraryRecordsByFilterUrl(): string {
    return `${this.apiBaseUrl}/LibraryRecord/advance-search`;
  }

  static addLibraryRecordUrl(): string {
    return `${this.apiBaseUrl}/LibraryRecord`;
  }

  static libraryRecordByIdUrl(id: string): string {
    return `${this.apiBaseUrl}/LibraryRecord/${id}`;
  }

  static generatePreSignedUrl(fileType: string) {
    return `${this.apiBaseUrl}/S3/generate-upload-url?fileType=${fileType}`;
  }

  // #endregion;

  //#region Attendance

  static addAttendanceBatchUrl(): string {
    return `${this.apiBaseUrl}/Attendance/batch`;
  }

  static filterAttendanceUrl(): string {
    return `${this.apiBaseUrl}/Attendance/advance-search`;
  }

  static attendanceByIdUrl(id: string): string {
    return `${this.apiBaseUrl}/Attendance/${id}`;
  }

  static attendanceByStudentIdUrl(studentId: string): string {
    return `${this.apiBaseUrl}/Attendance/student/${studentId}`;
  }

  //#endregion
}
