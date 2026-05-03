import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

export function differentPasswordValidator(currentPasswordControlName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const parent = control.parent;
    if (!parent) {
      return null;
    }

    const currentPasswordControl = parent.get(currentPasswordControlName);
    if (!currentPasswordControl || !currentPasswordControl.value) {
      return null;
    }

    if (control.value === currentPasswordControl.value) {
      return { sameAsCurrentPassword: true };
    }

    return null;
  };
}
