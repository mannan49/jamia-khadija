import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appDigitsOnly]',
  standalone: true,
})
export class DigitsOnlyDirective {
  @Input('appDigitsOnly') maxLength: number | null | undefined = null;

  constructor(private el: ElementRef) {}

  @HostListener('input')
  onInput() {
    if (!this.maxLength) return;

    let value: string = this.el.nativeElement.value;

    value = value.replace(/\D/g, '');

    if (this.maxLength > 0) {
      value = value.substring(0, this.maxLength);
    }

    this.el.nativeElement.value = value;

    this.el.nativeElement.dispatchEvent(new Event('input', { bubbles: true }));
  }
}
