import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function customEmailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const email: string = control.value;
    if (!email) return null;

    // Check for allowed format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { invalidEmail: true };
    }

    // Allow only: a-z, A-Z, 0-9, ., @
    const specialCharPattern = /[^a-zA-Z0-9@.]/;
    if (specialCharPattern.test(email)) {
      return { specialCharEmail: true };
    }

    return null;
  };
}
