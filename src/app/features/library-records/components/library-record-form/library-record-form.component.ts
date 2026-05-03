import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { catchError, EMPTY, filter, finalize, take, tap } from 'rxjs';

import { ToasterMessageConstants } from '@constants/toaster-message.constant';

import { Select } from '@models/shared/select.model';
import { Student } from '@models/entities/student.model';
import { LibraryBook } from '@models/entities/library-book.model';
import { StudentFilter } from '@models/payload/student-filter.model';
import { LibraryRecord } from '@models/entities/library-record.model';
import { PagedResponse } from '@models/response/paged-response.model';
import { ActionResponse } from '@models/response/action-response.model';
import { LibraryBookFilter } from '@models/payload/library-book-filter.model';
import { LibraryRecordFilter } from '@models/payload/library-record-filter.model';

import { HotToastService } from '@ngxpert/hot-toast';
import { ApiHttpService } from '@shared/services/api-http.service';

@Component({
  selector: 'app-library-record-form',
  standalone: false,
  templateUrl: './library-record-form.component.html',
})
export class LibraryRecordFormComponent {
  loading = false;
  isEditMode = false;
  recordLoading = false;
  studentsLoading = false;
  booksLoading = false;
  recordForm: FormGroup;
  isOtherStudentSelected = false;
  existingRecordId = String.Empty;

  studentsList: Select[] = [];
  booksList: Select[] = [];

  conditionList: Select[] = [
    { Value: 'Good', Display: 'اچھی حالت' },
    { Value: 'Fair', Display: 'قابل قبول' },
    { Value: 'Damaged', Display: 'خراب' },
  ];

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
    this.fetchBooks();
    if (this.isEditMode) {
      this.recordLoading = true;
      this.fetchRecordData();
    }
  }

  initializeForm() {
    const today = new Date().toISOString().split('T')[0];
    this.recordForm = this.formBuilder.group({
      borrowerRefId: [String.Empty, Validators.required],
      borrowerText: [String.Empty],
      bookRefId: [String.Empty, Validators.required],
      bookText: [String.Empty],
      borrowDate: [today, Validators.required],
      returnDate: [String.Empty],
      issuerName: [String.Empty, Validators.required],
      isBorrowed: [true],
      condition: [String.Empty, Validators.required],
      conditionOnReturn: [String.Empty],
      remarks: [String.Empty],
    });
  }

  fetchStudents() {
    this.studentsLoading = true;
    const studentFilter = new StudentFilter();
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
            Display: `${s?.Name}  ولد ${s?.FatherName}`,
          }));
          this.studentsList.push({
            Value: 'Other',
            Display: 'دیگر',
          });
        }),
        catchError(() => EMPTY),
        finalize(() => (this.studentsLoading = false))
      )
      .subscribe();
  }

  fetchBooks() {
    this.booksLoading = true;
    const bookFilter = new LibraryBookFilter();
    bookFilter.PageIndex = 1;
    bookFilter.Limit = 1000;
    this.apiHttpService
      .getLibraryBooksByFilter(bookFilter)
      .pipe(
        take(1),
        filter(res => !!res),
        tap((res: PagedResponse<LibraryBook>) => {
          this.booksList = res.Items.map(b => ({
            Value: b.Id,
            Display: `${b.Title} — ${b.Author}`,
          }));
        }),
        catchError(() => EMPTY),
        finalize(() => (this.booksLoading = false))
      )
      .subscribe();
  }

  onStudentChange(studentId: string) {
    this.isOtherStudentSelected = studentId.equals('Other');

    const selected = this.studentsList.find(s => s.Value === studentId);
    const name = selected?.Display?.split('—')[0]?.trim() ?? String.Empty;

    this.recordForm.patchValue({ borrowerText: name });

    if (!this.isOtherStudentSelected) {
      this.recordForm.patchValue({ borrowerText: name });
    } else {
      this.recordForm.patchValue({
        borrowerText: String.Empty,
        borrowerRefId: 'Other'
      });
    }
  }

  onBookChange(bookId: string) {
    const selected = this.booksList.find(b => b.Value === bookId);
    const title = selected?.Display?.split('—')[0]?.trim() ?? String.Empty;
    this.recordForm.patchValue({ bookText: title });
  }

  fetchRecordData() {
    const recordFilter = new LibraryRecordFilter();
    recordFilter.Id = this.existingRecordId;
    this.apiHttpService
      .getLibraryRecordsByFilter(recordFilter)
      .pipe(
        take(1),
        filter(res => !!res),
        tap((res: PagedResponse<LibraryRecord>) => {
          this.patchRecordForm(res?.Items?.[0]);
          this.isOtherStudentSelected = res?.Items?.[0]?.Borrower?.RefId?.equals('Other');
        }),
        catchError(() => EMPTY),
        finalize(() => (this.recordLoading = false))
      )
      .subscribe();
  }

  patchRecordForm(record: LibraryRecord) {
    this.recordForm.patchValue({
      borrowerRefId: record?.Borrower?.RefId,
      borrowerText: record?.Borrower?.Text,
      bookRefId: record?.LibraryBook?.RefId,
      bookText: record?.LibraryBook?.Text,
      borrowDate: record?.BorrowDate,
      returnDate: record?.ReturnDate,
      issuerName: record?.IssuerName,
      isBorrowed: record?.IsBorrowed,
      condition: record?.Condition,
      conditionOnReturn: record?.ConditionOnReturn ?? String.Empty,
      remarks: record?.Remarks ?? String.Empty,
    });
  }

  onSubmitForm() {
    if (this.recordForm.invalid) return;

    const formValue = this.recordForm.value;
    const payload: LibraryRecord = {
      LibraryBook: { RefId: formValue.bookRefId, Text: formValue.bookText },
      Borrower: { RefId: formValue.borrowerRefId, Text: formValue.borrowerText },
      BorrowDate: formValue.borrowDate,
      ReturnDate: formValue.returnDate || null,
      ActualReturnDate: null,
      IssuerName: formValue.issuerName,
      IsBorrowed: formValue.isBorrowed,
      Condition: formValue.condition,
      ConditionOnReturn: formValue.conditionOnReturn,
      Remarks: formValue.remarks,
      IssuedBy: null,
    } as LibraryRecord;

    if (this.isEditMode) {
      this.editRecord(payload);
    } else {
      this.addRecord(payload);
    }
  }

  addRecord(payload: LibraryRecord) {
    this.loading = true;
    this.apiHttpService
      .addLibraryRecord(payload)
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

  editRecord(payload: LibraryRecord) {
    this.loading = true;
    this.apiHttpService
      .updateLibraryRecord(this.existingRecordId, payload)
      .pipe(
        take(1),
        tap((res: ActionResponse) => {
          this.toast.success(res?.Message);
          this.router.navigate(['library-records']);
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
    const today = new Date().toISOString().split('T')[0];
    this.recordForm.reset({
      borrowerRefId: String.Empty,
      borrowerText: String.Empty,
      bookRefId: String.Empty,
      bookText: String.Empty,
      borrowDate: today,
      returnDate: String.Empty,
      issuerName: String.Empty,
      isBorrowed: true,
      condition: String.Empty,
      conditionOnReturn: String.Empty,
      remarks: String.Empty,
    });
  }
}
