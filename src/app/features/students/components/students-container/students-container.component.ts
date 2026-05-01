import { Router } from '@angular/router';
import { Component } from '@angular/core';

import { take, filter, tap, catchError, EMPTY, finalize } from 'rxjs';

import { Select } from '@models/shared/select.model';
import { Student } from '@models/entities/student.model';
import { StudentFilter } from '@models/payload/student-filter.model';
import { PagedResponse } from '@models/response/paged-response.model';
import { ActionResponse } from '@models/response/action-response.model';

import { HotToastService } from '@ngxpert/hot-toast';
import { ApiHttpService } from '@shared/services/api-http.service';

@Component({
  selector: 'app-students-container',
  standalone: false,
  templateUrl: './students-container.component.html',
  styleUrl: './students-container.component.css',
})
export class StudentsContainerComponent {
  loading = false;
  searchedQuery = String.Empty;
  selectedClass = String.Empty;
  selectedGender = String.Empty;
  selectedDepartment = String.Empty;
  pagedStudents: PagedResponse<Student>;

  classesList: Select[] = [
    { Value: 'پارہ 1', Display: 'پارہ ۱' },
    { Value: 'پارہ 2', Display: 'پارہ ۲' },
    { Value: 'پارہ 3', Display: 'پارہ ۳' },
    { Value: 'ناظرہ', Display: 'ناظرہ' },
    { Value: 'حفظ', Display: 'حفظ' },
  ];

  genderList: Select[] = [
    { Value: 'male', Display: 'لڑکا' },
    { Value: 'female', Display: 'لڑکی' },
  ];

  departmentsList: Select[] = [
    { Value: 'hifz', Display: 'حفظ قرآن' },
    { Value: 'nazra', Display: 'ناظرہ قرآن' },
    { Value: 'dars_nizami', Display: 'درس نظامی' },
    { Value: 'tajweed', Display: 'تجوید' },
  ];

  constructor(
    private router: Router,
    private toast: HotToastService,
    private apiHttpService: ApiHttpService
  ) {}

  ngOnInit() {
    this.fetchStudents();
  }

  fetchStudents() {
    this.loading = true;
    const studentFilter = this.constructStudentFilter();
    this.getStudentsByFilter(studentFilter);
  }

  constructStudentFilter(): StudentFilter {
    const studentFilter = new StudentFilter();
    studentFilter.SearchQuery = this.searchedQuery;
    studentFilter.Class = this.selectedClass;
    studentFilter.Gender = this.selectedGender;
    studentFilter.Department = this.selectedDepartment;
    return studentFilter;
  }

  getStudentsByFilter(studentFilter: StudentFilter) {
    this.apiHttpService
      .filterStudents(studentFilter)
      .pipe(
        take(1),
        filter(res => !!res),
        tap((res: PagedResponse<Student>) => {
          this.pagedStudents = res;
        }),
        catchError(() => {
          return EMPTY;
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe();
  }

  handlePageChange(index: number) {
    const studentFilter = this.constructStudentFilter();
    studentFilter.PageIndex = index;
    this.loading = true;
    this.getStudentsByFilter(studentFilter);
  }

  onAddNewButtonClick() {
    this.router.navigate(['students/form']);
  }

  handleClassSelectionChange(cls: string) {
    this.selectedClass = cls;
    this.fetchStudents();
  }

  handleGenderSelectionChange(gender: string) {
    this.selectedGender = gender;
    this.fetchStudents();
  }

  handleDepartmentSelectionChange(department: string) {
    this.selectedDepartment = department;
    this.fetchStudents();
  }

  handleDeleteButtonClick(studentId: string) {
    this.apiHttpService
      .deleteStudent(studentId)
      .pipe(
        take(1),
        filter(res => !!res),
        tap((res: ActionResponse) => {
          this.toast.success(res?.Message);
          this.fetchStudents();
        }),
        catchError(() => {
          return EMPTY;
        })
      )
      .subscribe();
  }

  handleSearchClick(query: string) {
    this.searchedQuery = query;
    this.fetchStudents();
  }
}
