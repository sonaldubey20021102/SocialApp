import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-content select="[dialogTrigger]"></ng-content>
    
    <div *ngIf="open" class="fixed inset-0 z-50">
      <!-- Overlay -->
      <div 
        class="fixed inset-0 bg-black/50 animate-in fade-in-0"
        (click)="close()"
      ></div>
      
      <!-- Content -->
      <div class="fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%]">
        <div [class]="contentClasses">
          <ng-content select="[dialogContent]"></ng-content>
        </div>
      </div>
    </div>
  `
})
export class DialogComponent {
  @Input() open = false;
  @Input() class = '';
  @Output() openChange = new EventEmitter<boolean>();

  get contentClasses(): string {
    return `w-full max-w-lg bg-background border rounded-lg shadow-lg p-6 animate-in fade-in-0 zoom-in-95 ${this.class}`.trim();
  }

  close(): void {
    this.open = false;
    this.openChange.emit(false);
  }
}

@Component({
  selector: 'app-dialog-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col space-y-1.5 text-center sm:text-left mb-4">
      <ng-content></ng-content>
    </div>
  `
})
export class DialogHeaderComponent {}

@Component({
  selector: 'app-dialog-title',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h3 class="text-lg font-semibold leading-none tracking-tight">
      <ng-content></ng-content>
    </h3>
  `
})
export class DialogTitleComponent {}

@Component({
  selector: 'app-dialog-description',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p class="text-sm text-muted-foreground">
      <ng-content></ng-content>
    </p>
  `
})
export class DialogDescriptionComponent {}
