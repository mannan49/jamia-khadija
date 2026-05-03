import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cnic',
  standalone: true,
})
export class CnicPipe implements PipeTransform {
  transform(value: string | number | null | undefined): string {
    if (!value) return '';

    const digits = value.toString().replace(/\D/g, '');

    if (digits.length !== 13 && digits.length !== 11) {
      return digits;
    }

    const formatted =
      digits.length === 11
        ? `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`
        : `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12, 13)}`;

    return formatted;
  }
}
