import { Router } from '@angular/router';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { environment } from 'src/environments/environment';

import { Dialog } from '@models/shared/diloag.model';
import { LibraryBook } from '@models/entities/library-book.model';
import { PagedResponse } from '@models/response/paged-response.model';

import { DialogService } from '@shared/services/dialog.service';

@Component({
  selector: 'app-library-book-table',
  standalone: false,
  templateUrl: './library-book-table.component.html',
})
export class LibraryBookTableComponent {
  @Input() pagedLibraryBooks: PagedResponse<LibraryBook>;
  @Output() deleteButtonClicked = new EventEmitter<string>();

  cloudFrontUrl = environment.cloudFrontUrl;

  constructor(
    private router: Router,
    private dialogService: DialogService
  ) {}

  onEditButtonClick(bookId: string) {
    this.router.navigate([`library-books/form/${bookId}`]);
  }

  onFileClick(url: string) {
    window.open(this.cloudFrontUrl + url, '_blank');
  }

  onDeleteButtonClick(bookId: string) {
    const dialogText: Dialog = {
      title: 'کتاب حذف کریں',
      message: 'کیا آپ واقعی اس کتاب کو حذف کرنا چاہتے ہیں؟',
      confirmText: 'حذف کریں',
      cancelText: 'منسوخ',
      confirmButtonClass: 'bg-secondary',
    };

    this.dialogService.confirm(dialogText).subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.deleteButtonClicked.emit(bookId);
      }
    });
  }
}
