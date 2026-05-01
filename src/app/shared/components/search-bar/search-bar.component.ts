import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css',
})
export class SearchBarComponent {
  @Output() searchClicked = new EventEmitter<string>();
  query = String.Empty;
  private searchSubject = new Subject<string>();

  constructor() {
    this.searchSubject.pipe(
      debounceTime(1000)
    ).subscribe(query => {
      this.onSearchButtonClick();
    });
  }

  onInputChange() {
    this.searchSubject.next(this.query);
  }

  onSearchButtonClick() {
    this.searchClicked.emit(this.query);
  }
}
