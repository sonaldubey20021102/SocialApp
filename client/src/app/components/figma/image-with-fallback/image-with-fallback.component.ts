import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==';

@Component({
  selector: 'app-image-with-fallback',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (!didError()) {
      <img
        [src]="src"
        [alt]="alt"
        [class]="class"
        [style]="style"
        (error)="onError()"
      />
    } @else {
      <div [class]="wrapperClasses" [style]="style">
        <div class="flex items-center justify-center w-full h-full">
          <img [src]="errorImage" alt="Error loading image" [attr.data-original-url]="src" />
        </div>
      </div>
    }
  `
})
export class ImageWithFallbackComponent {
  @Input() src = '';
  @Input() alt = '';
  @Input() class = '';
  @Input() style = '';

  didError = signal(false);
  errorImage = ERROR_IMG_SRC;

  get wrapperClasses(): string {
    return `inline-block bg-gray-100 text-center align-middle ${this.class}`.trim();
  }

  onError(): void {
    this.didError.set(true);
  }
}
