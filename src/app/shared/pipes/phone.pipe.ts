import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phone',
  standalone: true,
})
export class PhonePipe implements PipeTransform {
  transform(value: string | number | null | undefined): string {
    if (!value) return '';

    const digits = value.toString().replace(/\D/g, '');

    if (digits.length !== 11) {
      return digits;
    }

    return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  }
}
