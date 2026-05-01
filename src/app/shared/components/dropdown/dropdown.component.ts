import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  imports: [CommonModule],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css',
})
export class DropdownComponent {
  @Input() label = String.Empty;
  @Input() placeholder = String.Empty;
  @Input() options: any[] = [];
  @Input() valueField = 'Value';
  @Input() displayField = 'Display';
  @Input() className = String.Empty;
  @Input() doNotShowFirstOption = false;

  @Output() selectionChanged = new EventEmitter<string>();

  onSelect(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.selectionChanged.emit(value);
  }
}
