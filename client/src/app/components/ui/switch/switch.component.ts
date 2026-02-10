import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-switch',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SwitchComponent),
      multi: true
    }
  ],
  template: `
    <button
      type="button"
      role="switch"
      [attr.aria-checked]="checked"
      [attr.data-state]="checked ? 'checked' : 'unchecked'"
      [disabled]="disabled"
      (click)="toggle()"
      [class]="switchClasses"
    >
      <span [class]="thumbClasses" [attr.data-state]="checked ? 'checked' : 'unchecked'"></span>
    </button>
  `
})
export class SwitchComponent implements ControlValueAccessor {
  @Input() checked = false;
  @Input() disabled = false;
  @Input() class = '';
  @Output() checkedChange = new EventEmitter<boolean>();

  onChange: (value: boolean) => void = () => {};
  onTouched: () => void = () => {};

  get switchClasses(): string {
    const base = 'peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';
    const stateClass = this.checked 
      ? 'bg-primary' 
      : 'bg-switch-background';
    return `${base} ${stateClass} ${this.class}`.trim();
  }

  get thumbClasses(): string {
    const base = 'pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform';
    const stateClass = this.checked 
      ? 'translate-x-4' 
      : 'translate-x-0';
    return `${base} ${stateClass}`.trim();
  }

  toggle(): void {
    if (this.disabled) return;
    this.checked = !this.checked;
    this.onChange(this.checked);
    this.checkedChange.emit(this.checked);
    this.onTouched();
  }

  writeValue(value: boolean): void {
    this.checked = value || false;
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
