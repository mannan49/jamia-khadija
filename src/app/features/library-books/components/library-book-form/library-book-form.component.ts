import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { environment } from 'src/environments/environment';
import { catchError, EMPTY, filter, finalize, take, tap } from 'rxjs';

import { Select } from '@models/shared/select.model';
import { Attachment } from '@models/shared/attachment.model';
import { LibraryBook } from '@models/entities/library-book.model';
import { PagedResponse } from '@models/response/paged-response.model';
import { ActionResponse } from '@models/response/action-response.model';
import { LibraryBookFilter } from '@models/payload/library-book-filter.model';

import { HotToastService } from '@ngxpert/hot-toast';
import { ApiHttpService } from '@shared/services/api-http.service';
import { ToasterMessageConstants } from '@constants/toaster-message.constant';

@Component({
  selector: 'app-library-book-form',
  standalone: false,
  templateUrl: './library-book-form.component.html',
})
export class LibraryBookFormComponent {
  loading = false;
  isEditMode = false;
  bookLoading = false;
  bookForm: FormGroup;
  resetMediaState = false;
  existingBookId = String.Empty;
  cloudFrontUrl = environment.cloudFrontUrl;

  coverImage: Attachment = null;
  file: Attachment = null;
  existingCoverImageUrl = String.Empty;
  existingFileUrl = String.Empty;

  categoryList: Select[] = [
    { Value: 'Tafseer', Display: 'تفسیر' },
    { Value: 'Hadees', Display: 'حدیث' },
    { Value: 'Seerat', Display: 'سیرت' },
    { Value: 'Fiqh', Display: 'فقہ' },
    { Value: 'Aqeedah', Display: 'عقیدہ' },
    { Value: 'Usool-ul-Fiqh', Display: 'اصول الفقہ' },
    { Value: 'Nahw-o-Sarf', Display: 'نحو و صرف' },
    { Value: 'Other', Display: 'دیگر' },
  ];

  languageList: Select[] = [
    { Value: 'Arabic', Display: 'عربی' },
    { Value: 'Urdu', Display: 'اردو' },
    { Value: 'English', Display: 'انگریزی' },
    { Value: 'Farsi', Display: 'فارسی' },
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toast: HotToastService,
    private formBuilder: FormBuilder,
    private apiHttpService: ApiHttpService
  ) {
    this.existingBookId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.existingBookId;
  }

  ngOnInit() {
    this.initializeForm();
    if (this.isEditMode) {
      this.bookLoading = true;
      this.fetchBookData();
    }
  }

  initializeForm() {
    this.bookForm = this.formBuilder.group({
      title: [String.Empty, Validators.required],
      description: [String.Empty],
      author: [String.Empty, Validators.required],
      publisher: [String.Empty],
      publishedYear: [String.Empty],
      language: [String.Empty, Validators.required],
      category: [String.Empty, Validators.required],
      edition: [String.Empty],
      totalCopies: [1, [Validators.required, Validators.min(1)]],
      availableCopies: [1, [Validators.required, Validators.min(0)]],
    });
  }

  fetchBookData() {
    const bookFilter = new LibraryBookFilter();
    bookFilter.Id = this.existingBookId;
    this.apiHttpService
      .getLibraryBooksByFilter(bookFilter)
      .pipe(
        take(1),
        filter(res => !!res),
        tap((res: PagedResponse<LibraryBook>) => {
          const book = res?.Items?.[0];
          if (book) {
            this.patchBookForm(book);
          }
        }),
        catchError(() => EMPTY),
        finalize(() => {
          this.bookLoading = false;
        })
      )
      .subscribe();
  }

  patchBookForm(book: LibraryBook) {
    this.bookForm.patchValue({
      title: book?.Title,
      description: book?.Description,
      author: book?.Author,
      publisher: book?.Publisher,
      publishedYear: book?.PublishedYear,
      language: book?.Language,
      category: book?.Category,
      edition: book?.Edition,
      totalCopies: book?.TotalCopies,
      availableCopies: book?.AvailableCopies,
    });
    this.coverImage = book?.CoverImage ?? null;
    this.file = book?.File ?? null;
    if (book?.CoverImage?.Url) {
      this.existingCoverImageUrl = this.cloudFrontUrl + book.CoverImage.Url;
    }
    if (book?.File?.Url) {
      this.existingFileUrl = this.cloudFrontUrl + book.File.Url;
    }
  }

  handleCoverImageUploaded(attachment: Attachment) {
    this.coverImage = attachment;
  }

  handleFileUploaded(attachment: Attachment) {
    this.file = attachment;
  }

  onSubmitForm() {
    if (this.bookForm.invalid) return;

    const payload: LibraryBook = {
      Title: this.bookForm.value.title,
      Description: this.bookForm.value.description,
      Author: this.bookForm.value.author,
      Publisher: this.bookForm.value.publisher,
      PublishedYear: this.bookForm.value.publishedYear,
      Language: this.bookForm.value.language,
      Category: this.bookForm.value.category,
      Edition: this.bookForm.value.edition,
      TotalCopies: this.bookForm.value.totalCopies,
      AvailableCopies: this.bookForm.value.availableCopies,
      CoverImage: this.coverImage,
      File: this.file,
    };

    if (this.isEditMode) {
      this.editBook(payload);
    } else {
      this.addBook(payload);
    }
  }

  addBook(payload: LibraryBook) {
    this.loading = true;
    this.apiHttpService
      .addLibraryBook(payload)
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

  editBook(payload: LibraryBook) {
    this.loading = true;
    this.apiHttpService
      .updateLibraryBook(this.existingBookId, payload)
      .pipe(
        take(1),
        tap((res: ActionResponse) => {
          this.toast.success(res?.Message);
          this.router.navigate(['library-books']);
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

  resetForm() {
    this.bookForm.reset({
      title: String.Empty,
      description: String.Empty,
      author: String.Empty,
      publisher: String.Empty,
      publishedYear: String.Empty,
      language: String.Empty,
      category: String.Empty,
      edition: String.Empty,
      totalCopies: 1,
      availableCopies: 1,
    });
    this.coverImage = null;
    this.file = null;
    this.existingCoverImageUrl = String.Empty;
    this.existingFileUrl = String.Empty;
    this.resetMediaState = true;
    setTimeout(() => (this.resetMediaState = false));
  }
}
