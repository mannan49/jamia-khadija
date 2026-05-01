import { Router } from '@angular/router';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Dialog } from '@models/shared/diloag.model';
import { LibraryRecord } from '@models/entities/library-record.model';
import { PagedResponse } from '@models/response/paged-response.model';

import { DialogService } from '@shared/services/dialog.service';

@Component({
  selector: 'app-library-record-table',
  standalone: false,
  templateUrl: './library-record-table.component.html',
})
export class LibraryRecordTableComponent {
  @Input() pagedLibraryRecords: PagedResponse<LibraryRecord>;
  @Output() deleteButtonClicked = new EventEmitter<string>();

  constructor(
    private router: Router,
    private dialogService: DialogService
  ) {}

  onEditButtonClick(recordId: string) {
    this.router.navigate([`library-records/form/${recordId}`]);
  }

  onDeleteButtonClick(recordId: string) {
    const dialogText: Dialog = {
      title: 'ریکارڈ حذف کریں',
      message: 'کیا آپ واقعی اس ریکارڈ کو حذف کرنا چاہتے ہیں؟',
      confirmText: 'حذف کریں',
      cancelText: 'منسوخ',
      confirmButtonClass: 'bg-secondary',
    };

    this.dialogService.confirm(dialogText).subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.deleteButtonClicked.emit(recordId);
      }
    });
  }

  formatDate(date: Date): string {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('ur-PK');
  }
}
