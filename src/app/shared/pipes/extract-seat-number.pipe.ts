import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'extractSeatNumber',
  standalone: true
})

export class ExtractSeatNumberPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return String.Empty;
    const parts = value.split('-');
    return parts.length > 1 ? parts[1] : String.Empty;
  }
}
