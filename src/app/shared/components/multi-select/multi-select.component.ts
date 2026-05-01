import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ControlContainer, ReactiveFormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

import { Select } from '@models/shared/select.model';
import { ScopedReference } from '@models/shared/scoped-reference.model';

import { ErrorMessageComponent } from '../error-message/error-message.component';
import { ValidateControlDirective } from '@shared/directives/validate-control.directive';

@Component({
  selector: 'app-multi-select',
  imports: [
    CommonModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    ErrorMessageComponent,
    ValidateControlDirective,
  ],
  templateUrl: './multi-select.component.html',
  styleUrl: './multi-select.component.css',
})
export class MultiSelectComponent {
  @Input() label = String.Empty;
  @Input() placeholder = 'Select an option';
  @Input() controlName = String.Empty;
  @Input() options: Select[] = [];
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

  compareChapters = (c1: ScopedReference, c2: ScopedReference): boolean => {
    return c1 && c2 ? c1.RefId === c2.RefId : c1 === c2;
  };
}
