import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';

import { PagedResponse } from '@models/response/paged-response.model';

@Component({
  selector: 'app-pagination-actions',
  imports: [CommonModule],
  templateUrl: './pagination-actions.component.html',
  styleUrl: './pagination-actions.component.css',
})
export class PaginationActionsComponent {
  @Input() pagedResponse: PagedResponse<any>;
  @Output() pageChanged = new EventEmitter<number>();

  buttonArray: number[] = [];
  startPage = 1;
  currentPage = 1;

  ngOnChanges(changes: SimpleChanges): void {
    if (this.startPage === 1) {
      this.updateButtonArray();
    }
  }

  ngOnInit() {
    if (this.pagedResponse) {
      this.startPage = 1;
      this.updateButtonArray();
    }
  }

  private updateButtonArray() {
    const maxButtons = 6;
    const count = Math.min(maxButtons, this.pagedResponse?.TotalPages - this.startPage + 1);
    this.buttonArray = Array.from({ length: count }, (_, i) => this.startPage + i);
  }

  onNextButtonClick() {
    if (this.startPage + 6 <= this.pagedResponse?.TotalPages) {
      this.startPage += 6;
      this.currentPage = this.startPage;
      this.pageChanged.emit(this.currentPage);
      this.updateButtonArray();
    }
  }

  onBackButtonClick() {
    if (this.startPage - 6 > 0) {
      this.startPage -= 6;
      this.currentPage -= 6;
    } else {
      this.startPage = 1;
      this.currentPage = 1;
    }
    this.updateButtonArray();
  }

  onFirstButtonClick() {
    this.startPage = 1;
    this.currentPage = 1;
    this.updateButtonArray();
    this.pageChanged.emit(1);
  }

  onLastButtonClick() {
    this.startPage = this.pagedResponse?.TotalPages - ((this.pagedResponse?.TotalPages - 1) % 6);
    this.currentPage = this.pagedResponse?.TotalPages;
    this.updateButtonArray();
    this.pageChanged.emit(this.pagedResponse?.TotalPages);
  }

  onPageButtonClick(index: number) {
    this.currentPage = index;
    this.pageChanged.emit(index);
  }
}
