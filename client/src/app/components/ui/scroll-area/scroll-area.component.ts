import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scroll-area',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="scrollAreaClasses">
      <ng-content></ng-content>
    </div>
  `
})
export class ScrollAreaComponent {
  @Input() class = '';

  get scrollAreaClasses(): string {
    return `relative overflow-auto ${this.class}`.trim();
  }
}
