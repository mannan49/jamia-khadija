import { Router } from '@angular/router';
import { Component } from '@angular/core';

import { catchError, EMPTY, filter, finalize, take, tap } from 'rxjs';

import { LanguageList } from '@constants/language-list.constant';
import { BookCategoryList } from '@constants/book-category-list.constant';
import { ToasterMessageConstants } from '@constants/toaster-message.constant';

import { Select } from '@models/shared/select.model';
import { LibraryBook } from '@models/entities/library-book.model';
import { PagedResponse } from '@models/response/paged-response.model';
import { ActionResponse } from '@models/response/action-response.model';
import { LibraryBookFilter } from '@models/payload/library-book-filter.model';

import { HotToastService } from '@ngxpert/hot-toast';
import { ApiHttpService } from '@shared/services/api-http.service';

@Component({
  selector: 'app-library-book-container',
  standalone: false,
  templateUrl: './library-book-container.component.html',
})
export class LibraryBookContainerComponent {
  loading = false;
  languageList: Select[] = LanguageList;
  categoryList: Select[] = BookCategoryList;

  searchedQuery = String.Empty;
  selectedCategory = String.Empty;
  selectedLanguage = String.Empty;
  pagedLibraryBooks: PagedResponse<LibraryBook>;

  constructor(
    private router: Router,
    private toast: HotToastService,
    private apiHttpService: ApiHttpService
  ) {}

  ngOnInit() {
    this.fetchLibraryBooks();
  }

  fetchLibraryBooks() {
    this.loading = true;
    const libraryBookFilter = this.constructLibraryBookFilter();
    this.getLibraryBooksByFilter(libraryBookFilter);
  }

  constructLibraryBookFilter(): LibraryBookFilter {
    const libraryBookFilter = new LibraryBookFilter();
    libraryBookFilter.Category = this.selectedCategory;
    libraryBookFilter.Language = this.selectedLanguage;
    libraryBookFilter.Query = this.searchedQuery;
    return libraryBookFilter;
  }

  getLibraryBooksByFilter(libraryBookFilter: LibraryBookFilter) {
    this.apiHttpService
      .getLibraryBooksByFilter(libraryBookFilter)
      .pipe(
        take(1),
        filter(res => !!res),
        tap((res: PagedResponse<LibraryBook>) => {
          this.pagedLibraryBooks = res;
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

  onAddNewButtonClick() {
    this.router.navigate(['library-books/form']);
  }

  handleCategorySelectionChange(category: string) {
    this.selectedCategory = category;
    this.fetchLibraryBooks();
  }

  handleLanguageSelectionChange(language: string) {
    this.selectedLanguage = language;
    this.fetchLibraryBooks();
  }

  handleSearchClick(query: string) {
    this.searchedQuery = query;
    this.fetchLibraryBooks();
  }

  handlePageChange(index: number) {
    const libraryBookFilter = this.constructLibraryBookFilter();
    libraryBookFilter.PageIndex = index;
    this.loading = true;
    this.getLibraryBooksByFilter(libraryBookFilter);
  }

  handleDeleteButtonClick(bookId: string) {
    this.loading = true;
    this.apiHttpService
      .deleteLibraryBook(bookId)
      .pipe(
        take(1),
        filter(res => !!res),
        tap((res: ActionResponse) => {
          this.toast.success(res?.Message);
        }),
        catchError(error => {
          this.toast.error(error?.error?.message || ToasterMessageConstants.GENERAL_ERROR);
          return EMPTY;
        }),
        finalize(() => {
          this.fetchLibraryBooks();
        })
      )
      .subscribe();
  }
}
