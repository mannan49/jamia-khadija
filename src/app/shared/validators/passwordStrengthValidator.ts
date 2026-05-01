import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.value;
    if (!password) return null;

    const errors: ValidationErrors = {};
    if (password.length < 8) errors['minLength'] = true;
    if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) errors['alphanumeric'] = true;
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors['specialChar'] = true;

    return Object.keys(errors).length ? errors : null;
  };
}
