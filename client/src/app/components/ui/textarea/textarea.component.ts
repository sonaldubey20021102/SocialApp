import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-textarea',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true
    }
  ],
  template: `
    <textarea
      [placeholder]="placeholder"
      [disabled]="disabled"
      [required]="required"
      [id]="id"
      [rows]="rows"
      [(ngModel)]="value"
      (ngModelChange)="onInputChange($event)"
      (blur)="onTouched()"
      [class]="textareaClasses"
    ></textarea>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class TextareaComponent implements ControlValueAccessor {
  @Input() placeholder = '';
  @Input() disabled = false;
  @Input() required = false;
  @Input() id = '';
  @Input() rows = 3;
  @Input() class = '';

  value = '';
  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  get textareaClasses(): string {
    const base = 'placeholder:text-muted-foreground border-input flex min-h-16 w-full rounded-md border px-3 py-2 text-base bg-input-background transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] resize-none';
    return `${base} ${this.class}`.trim();
  }

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInputChange(value: string): void {
    this.value = value;
    this.onChange(value);
  }
}
