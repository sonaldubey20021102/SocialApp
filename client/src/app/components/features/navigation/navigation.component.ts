import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { User, ViewType } from '../../../models';
import { ButtonComponent, AvatarComponent } from '../../ui';
import {
  SidebarHeaderComponent,
  SidebarMenuComponent,
  SidebarMenuItemComponent,
  SidebarMenuButtonComponent,
  SidebarFooterComponent,
  SidebarGroupComponent,
  SidebarGroupContentComponent,
  SidebarGroupLabelComponent
} from '../../ui/sidebar/sidebar.component';
import { Router } from '@angular/router';



interface MenuItem {
  id: ViewType;
  label: string;
  icon: string;
  description: string;
  route:string;
}

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    AvatarComponent,
    SidebarHeaderComponent,
    SidebarMenuComponent,
    SidebarMenuItemComponent,
    SidebarMenuButtonComponent,
    SidebarFooterComponent,
    SidebarGroupComponent,
    SidebarGroupContentComponent,
    SidebarGroupLabelComponent
  ],
  template: `
    <app-sidebar-header class="border-b border-sidebar-border">
      <div class="flex items-center gap-3 px-4 py-4">
        <div class="p-2 bg-primary rounded-lg">
          <svg class="h-5 w-5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
        </div>
        <div>
          <h2 class="font-semibold">CommunityHub</h2>
          <p class="text-sm text-muted-foreground">Connect & Trade</p>
        </div>
      </div>
    </app-sidebar-header>

    <div class="flex-1 overflow-y-auto">
      <app-sidebar-group>
        <app-sidebar-group-label>Main</app-sidebar-group-label>
        <app-sidebar-group-content>
          <app-sidebar-menu>
            @for (item of menuItems; track item.id) {
              <app-sidebar-menu-item>
                <app-sidebar-menu-button
                  [isActive]="currentView === item.id"
                  [route]="item.route"
                  class="w-full justify-start">
                  <ng-container [ngSwitch]="item.icon">
                    <svg *ngSwitchCase="'home'" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                    </svg>
                    <svg *ngSwitchCase="'chat'" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                    </svg>
                    <svg *ngSwitchCase="'marketplace'" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                    </svg>
                    <svg *ngSwitchCase="'store'" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                    </svg>
                  </ng-container>
                  <span>{{ item.label }}</span>
                </app-sidebar-menu-button>
              </app-sidebar-menu-item>
            }
          </app-sidebar-menu>
        </app-sidebar-group-content>
      </app-sidebar-group>

      <app-sidebar-group>
        <app-sidebar-group-label>Account</app-sidebar-group-label>
        <app-sidebar-group-content>
          <app-sidebar-menu>
            @for (item of accountItems; track item.id) {
              <app-sidebar-menu-item>
                <app-sidebar-menu-button
                  [isActive]="currentView === item.id"
                   [route]="item.route"
                  class="w-full justify-start">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                  <span>{{ item.label }}</span>
                </app-sidebar-menu-button>
              </app-sidebar-menu-item>
            }
          </app-sidebar-menu>
        </app-sidebar-group-content>
      </app-sidebar-group>
    </div>

    <app-sidebar-footer class="border-t border-sidebar-border">
      <div class="p-4">
        <div class="flex items-center gap-3 mb-3">
          <app-avatar 
            [src]="currentUser.avatar ?? ''" 
            [alt]="currentUser.name"
            [fallback]="getInitials(currentUser.name)"
            class="h-8 w-8">
          </app-avatar>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium truncate">{{ currentUser.name }}</p>
            <p class="text-xs text-muted-foreground truncate">{{ currentUser.email }}</p>
          </div>
        </div>
        
        <app-button
          variant="outline"
          size="sm"
          (click)="onLogout()"
          class="w-full">
          <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          Sign Out
        </app-button>
      </div>
    </app-sidebar-footer>
  `
})
export class NavigationComponent {

  constructor(private router: Router) {}

  private authService = inject(AuthService);
  
  @Input() currentView: ViewType = 'community';
  @Input() currentUser!: User;
  @Output() viewChange = new EventEmitter<ViewType>();

  menuItems: MenuItem[] = [
    {
      id: 'community',
      label: 'Community Feed',
      icon: 'home',
      description: 'Latest updates and posts',
      route:'/feed'
    },
    {
      id: 'chat',
      label: 'Messages',
      icon: 'chat',
      description: 'Chat with community members',
      route:'/chat'

    },
    {
      id: 'marketplace',
      label: 'Marketplace',
      icon: 'marketplace',
      description: 'Browse local services',
      route:'/market'
    },
    {
      id: 'business',
      label: 'My Businesses',
      icon: 'store',
      description: 'Manage your services',
      route:'/business'
    }
  ];

  accountItems: MenuItem[] = [
    {
      id: 'profile',
      label: 'Profile',
      icon: 'user',
      description: 'Edit your profile',
      route:'/profile'
    }
  ];

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('');
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/'])
  }
}
