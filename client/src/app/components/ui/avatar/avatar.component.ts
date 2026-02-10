import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [class]="avatarClasses">
      <ng-container *ngIf="usesDirectImage; else projected">
        <img
          *ngIf="src && !hasError"
          [src]="src"
          [alt]="alt"
          (error)="onError()"
          class="aspect-square h-full w-full object-cover"
        />
        <span *ngIf="!src || hasError" [class]="fallbackClasses">
          {{ fallback }}
        </span>
      </ng-container>
      <ng-template #projected>
        <ng-content></ng-content>
      </ng-template>
    </span>
  `
})
export class AvatarComponent {
  @Input() class = '';
  @Input() src = '';
  @Input() alt = '';
  @Input() fallback = '';
  hasError = false;

  get avatarClasses(): string {
    return `relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${this.class}`.trim();
  }

  get fallbackClasses(): string {
    return 'flex h-full w-full items-center justify-center rounded-full bg-muted text-xs font-medium';
  }

  get usesDirectImage(): boolean {
    return !!(this.src || this.fallback);
  }

  onError(): void {
    this.hasError = true;
  }
}

@Component({
  selector: 'app-avatar-image',
  standalone: true,
  imports: [CommonModule],
  template: `
    <img 
      *ngIf="src && !hasError"
      [src]="src" 
      [alt]="alt"
      (error)="onError()"
      class="aspect-square h-full w-full object-cover"
    />
  `
})
export class AvatarImageComponent {
  @Input() src = '';
  @Input() alt = '';
  hasError = false;

  onError(): void {
    this.hasError = true;
  }
}

@Component({
  selector: 'app-avatar-fallback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [class]="fallbackClasses">
      <ng-content></ng-content>
    </span>
  `
})
export class AvatarFallbackComponent {
  @Input() class = '';

  get fallbackClasses(): string {
    return `flex h-full w-full items-center justify-center rounded-full bg-muted ${this.class}`.trim();
  }
}
