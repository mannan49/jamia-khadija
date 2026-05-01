import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { HotToastService } from '@ngxpert/hot-toast';
import { catchError, EMPTY, filter, finalize, take, tap } from 'rxjs';

import { Select } from '@models/shared/select.model';
import { Student } from '@models/entities/student.model';
import { LessonRecord } from '@models/entities/lesson-record.model';
import { StudentFilter } from '@models/payload/student-filter.model';
import { PagedResponse } from '@models/response/paged-response.model';
import { ActionResponse } from '@models/response/action-response.model';

import { ToasterMessageConstants } from '@constants/toaster-message.constant';

import { ApiHttpService } from '@shared/services/api-http.service';

@Component({
  selector: 'app-lesson-form',
  standalone: false,
  templateUrl: './lesson-form.component.html',
  styleUrl: './lesson-form.component.css',
})
export class LessonFormComponent {
  loading = false;
  isEditMode = false;
  recordLoading = false;
  studentsLoading = false;
  lessonForm: FormGroup;
  existingRecordId = String.Empty;

  studentsList: Select[] = [];

  lessonTypesList: Select[] = [
    { Value: 'Sabaq', Display: 'سبق' },
    { Value: 'Sabqi', Display: 'سبقی' },
    { Value: 'Manzil', Display: 'منزل' },
  ];

  parasList: Select[] = Array.from({ length: 30 }, (_, i) => ({
    Value: i + 1,
    Display: `پارہ ${i + 1}`,
  }));

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toast: HotToastService,
    private formBuilder: FormBuilder,
    private apiHttpService: ApiHttpService
  ) {
    this.existingRecordId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.existingRecordId;
  }

  ngOnInit() {
    this.initializeForm();
    this.fetchStudents();
    if (this.isEditMode) {
      this.recordLoading = true;
      this.fetchRecordData();
    }
  }

  initializeForm() {
    this.lessonForm = this.formBuilder.group({
      studentId: [String.Empty, Validators.required],
      studentName: [String.Empty],
      date: [String.Empty, Validators.required],
      lessons: this.formBuilder.array([this.buildLessonEntry()]),
    });
  }

  buildLessonEntry(): FormGroup {
    return this.formBuilder.group({
      type: [String.Empty, Validators.required],
      paraNumber: [null, Validators.required],
      listener: [String.Empty],
      mistakes: [0, [Validators.required, Validators.min(0)]],
      description: [String.Empty],
    });
  }

  get lessonsArray(): FormArray {
    return this.lessonForm.get('lessons') as FormArray;
  }

  addLessonEntry() {
    this.lessonsArray.push(this.buildLessonEntry());
  }

  removeLessonEntry(index: number) {
    if (this.lessonsArray.length > 1) {
      this.lessonsArray.removeAt(index);
    }
  }

  fetchStudents() {
    this.studentsLoading = true;
    const studentFilter = new StudentFilter();
    studentFilter.IsActive = true;
    studentFilter.PageIndex = 1;
    studentFilter.Limit = 1000;
    this.apiHttpService
      .filterStudents(studentFilter)
      .pipe(
        take(1),
        filter(res => !!res),
        tap((res: PagedResponse<Student>) => {
          this.studentsList = res.Items.map(s => ({
            Value: s.Id,
            Display: `${s.Name}`,
          }));
        }),
        catchError(() => EMPTY),
        finalize(() => (this.studentsLoading = false))
      )
      .subscribe();
  }

  onStudentChange(studentId: string) {
    const selected = this.studentsList.find(s => s.Value === studentId);
    // StudentName is the Display text before the dash
    const name = selected?.Display?.split('—')[0]?.trim() ?? String.Empty;
    this.lessonForm.patchValue({ studentName: name });
  }

  // ── Edit Mode Data Fetch ──────────────────────────────────────────────────

  fetchRecordData() {
    this.apiHttpService
      .getLessonRecordById(this.existingRecordId)
      .pipe(
        take(1),
        filter(res => !!res),
        tap((res: LessonRecord) => {
          this.patchLessonForm(res);
        }),
        catchError(() => EMPTY),
        finalize(() => (this.recordLoading = false))
      )
      .subscribe();
  }

  patchLessonForm(record: LessonRecord) {
    this.lessonForm.patchValue({
      studentId: record.StudentId,
      studentName: record.StudentName,
      date: record.Date?.substring(0, 10),
    });

    // Clear default entry then patch each lesson
    this.lessonsArray.clear();
    record.Lessons?.forEach(lesson => {
      this.lessonsArray.push(
        this.formBuilder.group({
          type: [lesson.Type, Validators.required],
          paraNumber: [lesson.ParaNumber, Validators.required],
          listener: [lesson.Listener],
          mistakes: [lesson.Mistakes, [Validators.required, Validators.min(0)]],
          description: [lesson.Description],
        })
      );
    });
  }

  // ── Submit ────────────────────────────────────────────────────────────────

  onSubmitForm() {
    if (this.lessonForm.invalid) return;
    if (this.isEditMode) {
      this.editRecord();
    } else {
      this.addRecord();
    }
  }

  addRecord() {
    this.loading = true;
    this.apiHttpService
      .addLessonRecord(this.lessonForm.value)
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
        finalize(() => (this.loading = false))
      )
      .subscribe();
  }

  editRecord() {
    this.loading = true;
    this.apiHttpService
      .updateLessonRecord(this.existingRecordId, this.lessonForm.value)
      .pipe(
        take(1),
        tap((res: ActionResponse) => {
          this.toast.success(res?.Message);
          this.router.navigate(['lesson-record']);
        }),
        catchError(() => {
          this.toast.error(ToasterMessageConstants.GENERAL_ERROR);
          return EMPTY;
        }),
        finalize(() => (this.loading = false))
      )
      .subscribe();
  }

  resetForm() {
    this.lessonForm.reset({
      studentId: String.Empty,
      studentName: String.Empty,
      date: String.Empty,
    });
    this.lessonsArray.clear();
    this.lessonsArray.push(this.buildLessonEntry());
  }
}
