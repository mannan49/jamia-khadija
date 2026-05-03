import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

export function PasswordMismatchValidator(passwordControlName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Don't validate empty values
    }

    const parent = control.parent;
    if (!parent) {
      return null;
    }

    const passwordControl = parent.get(passwordControlName);
    if (!passwordControl) {
      return null;
    }

    if (control.value !== passwordControl.value) {
      return { passwordMismatch: true };
    }

    return null;
  };
}
