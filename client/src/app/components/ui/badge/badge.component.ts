import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [class]="badgeClasses">
      <ng-content></ng-content>
    </span>
  `
})
export class BadgeComponent {
  @Input() variant: BadgeVariant = 'default';
  @Input() class = '';

  get badgeClasses(): string {
    const base = 'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors';
    
    const variants: Record<BadgeVariant, string> = {
      default: 'border-transparent bg-primary text-primary-foreground',
      secondary: 'border-transparent bg-secondary text-secondary-foreground',
      destructive: 'border-transparent bg-destructive text-destructive-foreground',
      outline: 'text-foreground'
    };

    return `${base} ${variants[this.variant]} ${this.class}`.trim();
  }
}
