import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { catchError, EMPTY, filter, finalize, take, tap } from 'rxjs';

import { Select } from '@models/shared/select.model';
import { Student } from '@models/entities/student.model';
import { ActionResponse } from '@models/response/action-response.model';

import { GenderList } from '@constants/gender-list.constant';
import { DepartmentList } from '@constants/department-list.constant';
import { ToasterMessageConstants } from '@constants/toaster-message.constant';

import { HotToastService } from '@ngxpert/hot-toast';
import { ApiHttpService } from '@shared/services/api-http.service';

@Component({
  selector: 'app-student-form',
  standalone: false,
  templateUrl: './student-form.component.html',
  styleUrl: './student-form.component.css',
})
export class StudentFormComponent {
  loading = false;
  isEditMode = false;
  studentLoading = false;
  studentForm: FormGroup;
  existingStudentId = String.Empty;

  genderList: Select[] = GenderList;
  departmentsList: Select[] = DepartmentList;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toast: HotToastService,
    private formBuilder: FormBuilder,
    private apiHttpService: ApiHttpService
  ) {
    this.existingStudentId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.existingStudentId;
  }

  ngOnInit() {
    this.initializeForm();
    if (this.isEditMode) {
      this.studentLoading = true;
      this.fetchStudentData();
    }
  }

  initializeForm() {
    this.studentForm = this.formBuilder.group({
      name: [String.Empty, Validators.required],
      fatherName: [String.Empty, Validators.required],
      dateOfBirth: [String.Empty],
      gender: [String.Empty],
      cnic: [String.Empty, Validators.required],
      parentCnic: [String.Empty],
      phone: [String.Empty],
      address: [String.Empty],
      class: ['حفظ'],
      enrollmentDate: [String.Empty, Validators.required],
      registrationNumber: [String.Empty],
      department: [String.Empty],
      isActive: [true],
    });
  }

  fetchStudentData() {
    this.apiHttpService
      .getStudentById(this.existingStudentId)
      .pipe(
        take(1),
        filter(res => !!res),
        tap((res: Student) => {
          this.patchStudentForm(res);
        }),
        catchError(() => {
          return EMPTY;
        }),
        finalize(() => {
          this.studentLoading = false;
        })
      )
      .subscribe();
  }

  patchStudentForm(student: Student) {
    this.studentForm.patchValue({
      name: student?.Name,
      fatherName: student?.FatherName,
      dateOfBirth: student?.DateOfBirth?.substring(0, 10),
      gender: student?.Gender,
      cnic: student?.Cnic,
      parentCnic: student?.ParentCnic,
      phone: student?.Phone,
      address: student?.Address,
      class: student?.Class ?? 'حفظ',
      enrollmentDate: student?.EnrollmentDate?.substring(0, 10),
      registrationNumber: student?.RegistrationNumber,
      department: student?.Department,
      isActive: student?.IsActive,
    });
  }

  onSubmitForm() {
    if (this.studentForm.invalid) return;
    if (this.isEditMode) {
      this.editStudent();
    } else {
      this.addStudent();
    }
  }

  addStudent() {
    this.loading = true;
    this.apiHttpService
      .addStudent(this.studentForm.value)
      .pipe(
        take(1),
        tap((res: ActionResponse) => {
          this.toast.success(res?.Message);
          this.resetForm();
        }),
        catchError(() => {
          this.toast.error(ToasterMessageConstants.GENERAL_ERROR);
          return EMPTY;
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe();
  }

  editStudent() {
    this.loading = true;
    this.apiHttpService
      .updateStudent(this.existingStudentId, this.studentForm.value)
      .pipe(
        take(1),
        tap((res: ActionResponse) => {
          this.toast.success(res?.Message);
          this.router.navigate(['students']);
        }),
        catchError(() => {
          this.toast.error(ToasterMessageConstants.GENERAL_ERROR);
          return EMPTY;
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe();
  }

  get isActive() {
    return this.studentForm.get('isActive');
  }

  resetForm() {
    this.studentForm.reset({
      name: String.Empty,
      fatherName: String.Empty,
      dateOfBirth: String.Empty,
      gender: String.Empty,
      cnic: String.Empty,
      parentCnic: String.Empty,
      phone: String.Empty,
      address: String.Empty,
      class: 'حفظ',
      enrollmentDate: String.Empty,
      registrationNumber: String.Empty,
      department: String.Empty,
      isActive: true,
    });
  }
}
