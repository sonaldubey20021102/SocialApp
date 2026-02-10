import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ],
  template: `
    <div class="relative">
      <button
        type="button"
        [class]="triggerClasses"
        (click)="toggleOpen()"
        [disabled]="disabled"
      >
        <span class="flex-1 text-left truncate">{{ selectedLabel || placeholder }}</span>
        <svg class="h-4 w-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      
      <div 
        *ngIf="isOpen"
        [class]="contentClasses"
      >
        <div 
          *ngFor="let option of options"
          [class]="itemClasses(option.value)"
          (click)="selectOption(option)"
        >
          {{ option.label }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class SelectComponent implements ControlValueAccessor {
  @Input() options: { value: string; label: string }[] = [];
  @Input() placeholder = 'Select...';
  @Input() disabled = false;
  @Input() class = '';
  @Output() valueChange = new EventEmitter<string>();

  value = '';
  isOpen = false;
  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  get selectedLabel(): string {
    const selected = this.options.find(o => o.value === this.value);
    return selected?.label || '';
  }

  get triggerClasses(): string {
    return `flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-input-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${this.class}`.trim();
  }

  get contentClasses(): string {
    return 'absolute z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95';
  }

  itemClasses(optionValue: string): string {
    const base = 'relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground';
    const selected = optionValue === this.value ? 'bg-accent' : '';
    return `${base} ${selected}`.trim();
  }

  toggleOpen(): void {
    if (this.disabled) return;
    this.isOpen = !this.isOpen;
  }

  selectOption(option: { value: string; label: string }): void {
    this.value = option.value;
    this.isOpen = false;
    this.onChange(this.value);
    this.valueChange.emit(this.value);
    this.onTouched();
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
}
