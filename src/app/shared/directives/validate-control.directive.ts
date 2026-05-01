import { Directive, Input, OnInit } from '@angular/core';
import { AbstractControl, NgControl } from '@angular/forms';

@Directive({
  selector: '[form_control]',
  exportAs: 'appValidate',
})
export class ValidateControlDirective implements OnInit {
  control: AbstractControl | null = null;

  constructor(private controlDir: NgControl) {}

  ngOnInit() {
    this.control = this.controlDir.control;
  }

  get showErrors(): boolean {
    return !!this.control && this.control.invalid && this.control.touched;
  }

  get firstErrorKey(): string | null {
    if (!this.control || !this.control.errors) return null;
    return Object.keys(this.control.errors)[0] || null;
  }
}
