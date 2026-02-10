import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-label',
  standalone: true,
  imports: [CommonModule],
  template: `
    <label [for]="for" [class]="labelClasses">
      <ng-content></ng-content>
    </label>
  `
})
export class LabelComponent {
  @Input() for = '';
  @Input() class = '';

  get labelClasses(): string {
    return `text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50 ${this.class}`.trim();
  }
}
