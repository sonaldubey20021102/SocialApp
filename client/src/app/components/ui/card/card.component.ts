import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="cardClasses" data-slot="card">
      <ng-content></ng-content>
    </div>
  `
})
export class CardComponent {
  @Input() class = '';

  get cardClasses(): string {
    return `bg-card text-card-foreground flex flex-col gap-6 rounded-xl border ${this.class}`.trim();
  }
}

@Component({
  selector: 'app-card-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="headerClasses" data-slot="card-header">
      <ng-content></ng-content>
    </div>
  `
})
export class CardHeaderComponent {
  @Input() class = '';

  get headerClasses(): string {
    return `grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6 ${this.class}`.trim();
  }
}

@Component({
  selector: 'app-card-title',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h4 [class]="titleClasses" data-slot="card-title">
      <ng-content></ng-content>
    </h4>
  `
})
export class CardTitleComponent {
  @Input() class = '';

  get titleClasses(): string {
    return `leading-none font-semibold ${this.class}`.trim();
  }
}

@Component({
  selector: 'app-card-description',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p [class]="descClasses" data-slot="card-description">
      <ng-content></ng-content>
    </p>
  `
})
export class CardDescriptionComponent {
  @Input() class = '';

  get descClasses(): string {
    return `text-muted-foreground ${this.class}`.trim();
  }
}

@Component({
  selector: 'app-card-content',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="contentClasses" data-slot="card-content">
      <ng-content></ng-content>
    </div>
  `
})
export class CardContentComponent {
  @Input() class = '';

  get contentClasses(): string {
    return `px-6 [&:last-child]:pb-6 ${this.class}`.trim();
  }
}

@Component({
  selector: 'app-card-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="footerClasses" data-slot="card-footer">
      <ng-content></ng-content>
    </div>
  `
})
export class CardFooterComponent {
  @Input() class = '';

  get footerClasses(): string {
    return `flex items-center px-6 pb-6 ${this.class}`.trim();
  }
}
