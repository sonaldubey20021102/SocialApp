import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { ViewType } from '../../../models';
import { SidebarComponent, SidebarContentComponent, SidebarProviderComponent } from '../../ui/sidebar/sidebar.component';
import { NavigationComponent } from '../navigation/navigation.component';
import { ChatInterfaceComponent } from '../chat-interface/chat-interface.component';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { MarketplaceComponent } from '../marketplace/marketplace.component';
import { CommunityFeedComponent } from '../community-feed/community-feed.component';
import { MyBusinessesComponent } from '../my-businesses/my-businesses.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    SidebarContentComponent,
    SidebarProviderComponent,
    NavigationComponent,
    ChatInterfaceComponent,
    UserProfileComponent,
    MarketplaceComponent,
    CommunityFeedComponent,
    MyBusinessesComponent,
    RouterOutlet
  ],
  template: `
    <app-sidebar-provider>
      <div class="flex h-screen w-full min-h-0">
        <app-sidebar>
          <app-sidebar-content>
            @if (currentUser(); as user) {
              <app-navigation
                [currentView]="currentView()"
                [currentUser]="user"
                (viewChange)="currentView.set($event)">
              </app-navigation>
            }
          </app-sidebar-content>
        </app-sidebar>
        <main  class="flex-1 min-h-0 overflow-hidden">
           <router-outlet></router-outlet>
        </main>
     
      </div>
    </app-sidebar-provider>
  `
})
export class MainDashboardComponent {
  private authService = inject(AuthService);
  
  currentView = signal<ViewType>('community');
  currentUser = this.authService.currentUser;
}
