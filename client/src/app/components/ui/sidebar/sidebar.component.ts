import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar-provider',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex min-h-svh w-full">
      <ng-content></ng-content>
    </div>
  `
})
export class SidebarProviderComponent {
  isOpen = signal(true);
  
  toggle(): void {
    this.isOpen.update(v => !v);
  }
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <aside [class]="sidebarClasses">
      <ng-content></ng-content>
    </aside>
  `
})
export class SidebarComponent {
  @Input() class = '';

  get sidebarClasses(): string {
    return `flex h-full w-64 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border ${this.class}`.trim();
  }
}

@Component({
  selector: 'app-sidebar-content',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-1 flex-col overflow-hidden">
      <ng-content></ng-content>
    </div>
  `
})
export class SidebarContentComponent {}

@Component({
  selector: 'app-sidebar-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="headerClasses">
      <ng-content></ng-content>
    </div>
  `
})
export class SidebarHeaderComponent {
  @Input() class = '';

  get headerClasses(): string {
    return `flex flex-col gap-2 ${this.class}`.trim();
  }
}

@Component({
  selector: 'app-sidebar-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="footerClasses">
      <ng-content></ng-content>
    </div>
  `
})
export class SidebarFooterComponent {
  @Input() class = '';

  get footerClasses(): string {
    return `flex flex-col gap-2 ${this.class}`.trim();
  }
}

@Component({
  selector: 'app-sidebar-group',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative flex w-full flex-col p-2">
      <ng-content></ng-content>
    </div>
  `
})
export class SidebarGroupComponent {}

@Component({
  selector: 'app-sidebar-group-label',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70">
      <ng-content></ng-content>
    </div>
  `
})
export class SidebarGroupLabelComponent {}

@Component({
  selector: 'app-sidebar-group-content',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full">
      <ng-content></ng-content>
    </div>
  `
})
export class SidebarGroupContentComponent {}

@Component({
  selector: 'app-sidebar-menu',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ul class="flex w-full min-w-0 flex-col gap-1">
      <ng-content></ng-content>
    </ul>
  `
})
export class SidebarMenuComponent {}

@Component({
  selector: 'app-sidebar-menu-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <li class="group/menu-item relative">
      <ng-content></ng-content>
    </li>
  `
})
export class SidebarMenuItemComponent {}

@Component({
  selector: 'app-sidebar-menu-button',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <a
      [class]="buttonClasses"
      [attr.data-active]="isActive"
      [routerLink]="route"
      routerLinkActive="bg-primary text-white"
    >
      <ng-content></ng-content>
    </a>


  `
})
export class SidebarMenuButtonComponent {
  @Input() isActive = false;
  @Input() class = '';
  @Input() route: string | any[] | null = null;
  @Output() onClick = new EventEmitter<void>();


  get buttonClasses(): string {
    const base = 'peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50';
    const activeClass = this.isActive 
      ? 'bg-sidebar-accent font-medium text-sidebar-accent-foreground' 
      : '';
    return `${base} ${activeClass} ${this.class}`.trim();
  }
}
