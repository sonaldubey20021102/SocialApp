import { Component, Input, Output, EventEmitter, ContentChildren, QueryList, AfterContentInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="tabsClasses">
      <ng-content></ng-content>
    </div>
  `
})
export class TabsComponent {
  @Input() defaultValue = '';
  @Input() class = '';
  activeTab = '';

  ngOnInit() {
    this.activeTab = this.defaultValue;
  }

  get tabsClasses(): string {
    return this.class;
  }

  setActiveTab(value: string): void {
    this.activeTab = value;
  }
}

@Component({
  selector: 'app-tabs-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="listClasses" role="tablist">
      <ng-content></ng-content>
    </div>
  `
})
export class TabsListComponent {
  @Input() class = '';

  get listClasses(): string {
    return `bg-muted text-muted-foreground inline-flex h-9 w-auto items-center justify-center rounded-lg p-1 ${this.class}`.trim();
  }
}

@Component({
  selector: 'app-tabs-trigger',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      type="button"
      role="tab"
      [class]="triggerClasses"
      [attr.data-state]="isActive ? 'active' : 'inactive'"
      (click)="onClick()"
    >
      <ng-content></ng-content>
    </button>
  `
})
export class TabsTriggerComponent {
  @Input() value = '';
  @Input() class = '';
  @Input() isActive = false;
  @Output() tabClick = new EventEmitter<string>();

  get triggerClasses(): string {
    const base = 'inline-flex items-center justify-center whitespace-nowrap rounded-md px-2.5 py-1 text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none';
    const activeClass = this.isActive 
      ? 'bg-card text-foreground shadow-sm' 
      : 'text-muted-foreground hover:text-foreground';
    return `${base} ${activeClass} ${this.class}`.trim();
  }

  onClick(): void {
    this.tabClick.emit(this.value);
  }
}

@Component({
  selector: 'app-tabs-content',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      *ngIf="isActive"
      [class]="contentClasses"
      role="tabpanel"
    >
      <ng-content></ng-content>
    </div>
  `
})
export class TabsContentComponent {
  @Input() value = '';
  @Input() class = '';
  @Input() isActive = false;

  get contentClasses(): string {
    return `mt-4 ${this.class}`.trim();
  }
}
