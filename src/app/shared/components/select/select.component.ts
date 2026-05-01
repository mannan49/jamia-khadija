import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ControlContainer, FormControl, ReactiveFormsModule } from '@angular/forms';

import { ValidateControlDirective } from '@shared/directives/validate-control.directive';

import { ErrorMessageComponent } from '../error-message/error-message.component';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ValidateControlDirective, ErrorMessageComponent],
  templateUrl: './select.component.html',
  styleUrl: './select.component.css',
})
export class SelectComponent {
  @Input() label = String.Empty;
  @Input() placeholder = 'Select an option';
  @Input() controlName = String.Empty;
  @Input() options: any[] = [];
  @Input() valueField = 'Value';
  @Input() displayField = 'Display';

  @Output() selectionChanged = new EventEmitter<any>();

  control!: FormControl;

  constructor(private controlContainer: ControlContainer) {}

  ngOnInit(): void {
    this.control = this.controlContainer.control?.get(this.controlName) as FormControl;
    this.control.valueChanges.subscribe(value => {
      this.selectionChanged.emit(value);
    });
  }
}
