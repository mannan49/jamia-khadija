import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appOnlyNumberInput]',
})
export class OnlyNumberInputDirective {
  @Input() index!: number;
  @Input() totalInputs!: number;

  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('input', ['$event']) 
  onInput(event: Event) {
    const input = this.el.nativeElement;
    const value = input.value;

    // Allow only single digit number
    if (!/^\d$/.test(value)) {
      input.value = '';
      return;
    }

    // Move to next input
    const next = input.nextElementSibling as HTMLInputElement;
    if (next && value) {
      next.focus();
    }
  }

  @HostListener('keydown', ['$event']) 
  onKeyDown(event: KeyboardEvent) {
    const input = this.el.nativeElement;

    if (event.key === 'Backspace' && !input.value) {
      const prev = input.previousElementSibling as HTMLInputElement;
      if (prev) {
        prev.focus();
      }
    }
  }
}
