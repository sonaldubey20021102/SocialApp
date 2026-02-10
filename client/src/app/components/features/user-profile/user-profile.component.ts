import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models';
import {
  CardComponent,
  CardContentComponent,
  CardHeaderComponent,
  CardTitleComponent,
  ButtonComponent,
  InputComponent,
  LabelComponent,
  TextareaComponent,
  AvatarComponent,
  BadgeComponent,
  TabsComponent,
  TabsListComponent,
  TabsTriggerComponent,
  TabsContentComponent,
  SwitchComponent
} from '../../ui';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardComponent,
    CardContentComponent,
    CardHeaderComponent,
    CardTitleComponent,
    ButtonComponent,
    InputComponent,
    LabelComponent,
    TextareaComponent,
    AvatarComponent,
    BadgeComponent,
    TabsComponent,
    TabsListComponent,
    TabsTriggerComponent,
    TabsContentComponent,
    SwitchComponent
  ],
  template: `
    <div class="h-full overflow-y-auto bg-background">
      <div class="max-w-4xl mx-auto p-6">
        <div class="mb-6">
          <h1>Profile</h1>
          <p class="text-muted-foreground">
            Manage your profile information and preferences
          </p>
        </div>

        @if (currentUser(); as user) {
          <app-tabs [defaultValue]="'profile'" class="space-y-6">
            <app-tabs-list>
              <app-tabs-trigger value="profile" [isActive]="activeTab() === 'profile'" (tabClick)="onTabClick($event)">
                Profile
              </app-tabs-trigger>
              <app-tabs-trigger value="settings" [isActive]="activeTab() === 'settings'" (tabClick)="onTabClick($event)">
                Settings
              </app-tabs-trigger>
              <app-tabs-trigger value="privacy" [isActive]="activeTab() === 'privacy'" (tabClick)="onTabClick($event)">
                Privacy
              </app-tabs-trigger>
            </app-tabs-list>

            <app-tabs-content value="profile" [isActive]="activeTab() === 'profile'" class="space-y-6">
              <app-card>
                <app-card-header>
                  <div class="flex items-center justify-between">
                    <app-card-title>Profile Information</app-card-title>
                    <app-button
                      variant="outline"
                      size="sm"
                      (click)="isEditing() ? handleCancel() : startEditing(user)">
                      @if (isEditing()) {
                        <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 6L6 18M6 6l12 12" />
                        </svg>
                        Cancel
                      } @else {
                        <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
                        </svg>
                        Edit
                      }
                    </app-button>
                  </div>
                </app-card-header>
                <app-card-content class="space-y-6">
                  <div class="flex items-start gap-6">
                    <div class="relative">
                      <app-avatar
                        [src]="user.avatar || ''"
                        [alt]="user.name"
                        [fallback]="getInitials(user.name)"
                        class="h-24 w-24">
                      </app-avatar>
                      @if (isEditing()) {
                        <app-button
                          variant="secondary"
                          size="sm"
                          class="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0">
                          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7h4l2-2h6l2 2h4v12H3z" />
                            <circle cx="12" cy="13" r="3"></circle>
                          </svg>
                        </app-button>
                      }
                    </div>

                    <div class="flex-1 space-y-4">
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <app-label for="name">Full Name</app-label>
                          @if (isEditing()) {
                            <app-input
                              id="name"
                              [ngModel]="editedUser()?.name || ''"
                              (ngModelChange)="updateEditedUser('name', $event)">
                            </app-input>
                          } @else {
                            <p class="mt-1 font-medium">{{ user.name }}</p>
                          }
                        </div>

                        <div>
                          <app-label for="email">Email</app-label>
                          @if (isEditing()) {
                            <app-input
                              id="email"
                              type="email"
                              [ngModel]="editedUser()?.email || ''"
                              (ngModelChange)="updateEditedUser('email', $event)">
                            </app-input>
                          } @else {
                            <p class="mt-1 font-medium">{{ user.email }}</p>
                          }
                        </div>
                      </div>

                      <div>
                        <app-label for="location">Location</app-label>
                        @if (isEditing()) {
                          <app-input
                            id="location"
                            [ngModel]="location()"
                            (ngModelChange)="location.set($event)"
                            placeholder="Enter your location">
                          </app-input>
                        } @else {
                          <div class="flex items-center gap-1 mt-1">
                            <svg class="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{{ location() }}</span>
                          </div>
                        }
                      </div>

                      <div>
                        <app-label for="bio">Bio</app-label>
                        @if (isEditing()) {
                          <app-textarea
                            id="bio"
                            [ngModel]="bio()"
                            (ngModelChange)="bio.set($event)"
                            placeholder="Tell us about yourself..."
                            [rows]="3">
                          </app-textarea>
                        } @else {
                          <p class="mt-1 text-muted-foreground">{{ bio() }}</p>
                        }
                      </div>

                      @if (isEditing()) {
                        <div class="flex gap-2">
                          <app-button (click)="handleSave()">
                            <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2zM17 21v-8H7v8" />
                            </svg>
                            Save Changes
                          </app-button>
                        </div>
                      }
                    </div>
                  </div>

                  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t">
                    <div class="text-center">
                      <div class="text-2xl font-bold text-primary">{{ mockStats().totalConnections }}</div>
                      <div class="text-sm text-muted-foreground">Connections</div>
                    </div>
                    <div class="text-center">
                      <div class="text-2xl font-bold text-primary">{{ mockStats().businessRoles }}</div>
                      <div class="text-sm text-muted-foreground">Business Roles</div>
                    </div>
                    <div class="text-center">
                      <div class="text-2xl font-bold text-primary">{{ mockStats().communityScore }}</div>
                      <div class="text-sm text-muted-foreground">Community Score</div>
                    </div>
                    <div class="text-center">
                      <div class="text-2xl font-bold text-primary">{{ mockStats().responseRate }}%</div>
                      <div class="text-sm text-muted-foreground">Response Rate</div>
                    </div>
                  </div>

                  <div class="pt-4 border-t">
                    <div class="flex items-center gap-2 text-sm text-muted-foreground">
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10m-12 10h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Member since {{ joinDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) }}</span>
                    </div>
                  </div>
                </app-card-content>
              </app-card>

              <app-card>
                <app-card-header>
                  <app-card-title class="flex items-center gap-2">
                    <svg class="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    Community Reviews
                  </app-card-title>
                </app-card-header>
                <app-card-content>
                  @if (mockReviews.length > 0) {
                    <div class="space-y-4">
                      @for (review of mockReviews; track review.id) {
                        <div class="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                          <app-avatar
                            [src]="review.avatar"
                            [alt]="review.reviewer"
                            [fallback]="getInitials(review.reviewer)"
                            class="h-8 w-8">
                          </app-avatar>
                          <div class="flex-1">
                            <div class="flex items-center gap-2 mb-1">
                              <span class="font-medium text-sm">{{ review.reviewer }}</span>
                              <div class="flex items-center">
                                @for (star of stars; track $index) {
                                  <svg
                                    class="h-3 w-3"
                                    [class.fill-current]="$index < review.rating"
                                    [class.text-yellow-500]="$index < review.rating"
                                    [class.text-gray-300]="$index >= review.rating"
                                    viewBox="0 0 24 24">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                  </svg>
                                }
                              </div>
                              <span class="text-xs text-muted-foreground">
                                {{ review.date.toLocaleDateString() }}
                              </span>
                            </div>
                            <p class="text-sm text-muted-foreground">{{ review.comment }}</p>
                          </div>
                        </div>
                      }
                    </div>
                  } @else {
                    <div class="text-center py-8 text-muted-foreground">
                      <svg class="h-12 w-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <p>No reviews yet</p>
                      <p class="text-sm">Start engaging with the community to receive reviews!</p>
                    </div>
                  }
                </app-card-content>
              </app-card>
            </app-tabs-content>

            <app-tabs-content value="settings" [isActive]="activeTab() === 'settings'" class="space-y-6">
              <app-card>
                <app-card-header>
                  <app-card-title class="flex items-center gap-2">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.4-1.4a2 2 0 01-.6-1.4v-3.4a6 6 0 10-12 0v3.4a2 2 0 01-.6 1.4L4 17h5m6 0a3 3 0 11-6 0" />
                    </svg>
                    Notification Settings
                  </app-card-title>
                </app-card-header>
                <app-card-content class="space-y-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <app-label>Message Notifications</app-label>
                      <p class="text-sm text-muted-foreground">Get notified about new messages</p>
                    </div>
                    <app-switch
                      [checked]="notifications().messages"
                      (checkedChange)="updateNotifications({ messages: $event })">
                    </app-switch>
                  </div>

                  <div class="flex items-center justify-between">
                    <div>
                      <app-label>Marketplace Updates</app-label>
                      <p class="text-sm text-muted-foreground">New services and offerings</p>
                    </div>
                    <app-switch
                      [checked]="notifications().marketplace"
                      (checkedChange)="updateNotifications({ marketplace: $event })">
                    </app-switch>
                  </div>

                  <div class="flex items-center justify-between">
                    <div>
                      <app-label>Community Posts</app-label>
                      <p class="text-sm text-muted-foreground">Updates from community feed</p>
                    </div>
                    <app-switch
                      [checked]="notifications().community"
                      (checkedChange)="updateNotifications({ community: $event })">
                    </app-switch>
                  </div>

                  <div class="flex items-center justify-between">
                    <div>
                      <app-label>Email Notifications</app-label>
                      <p class="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <app-switch
                      [checked]="notifications().email"
                      (checkedChange)="updateNotifications({ email: $event })">
                    </app-switch>
                  </div>
                </app-card-content>
              </app-card>
            </app-tabs-content>

            <app-tabs-content value="privacy" [isActive]="activeTab() === 'privacy'" class="space-y-6">
              <app-card>
                <app-card-header>
                  <app-card-title class="flex items-center gap-2">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                    Privacy Settings
                  </app-card-title>
                </app-card-header>
                <app-card-content class="space-y-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <app-label>Profile Visibility</app-label>
                      <p class="text-sm text-muted-foreground">Who can see your profile</p>
                    </div>
                    <app-badge variant="outline">Public</app-badge>
                  </div>

                  <div class="flex items-center justify-between">
                    <div>
                      <app-label>Show Email Address</app-label>
                      <p class="text-sm text-muted-foreground">Display email on your profile</p>
                    </div>
                    <app-switch
                      [checked]="privacy().showEmail"
                      (checkedChange)="updatePrivacy({ showEmail: $event })">
                    </app-switch>
                  </div>

                  <div class="flex items-center justify-between">
                    <div>
                      <app-label>Show Last Seen</app-label>
                      <p class="text-sm text-muted-foreground">Show when you were last online</p>
                    </div>
                    <app-switch
                      [checked]="privacy().showLastSeen"
                      (checkedChange)="updatePrivacy({ showLastSeen: $event })">
                    </app-switch>
                  </div>
                </app-card-content>
              </app-card>
            </app-tabs-content>
          </app-tabs>
        }
      </div>
    </div>
  `
})
export class UserProfileComponent {
  private authService = inject(AuthService);

  currentUser = this.authService.currentUser;
  activeTab = signal<'profile' | 'settings' | 'privacy'>('profile');
  isEditing = signal(false);
  editedUser = signal<User | null>(null);

  bio = signal('Passionate about connecting with my local community and supporting small businesses. Love discovering new services and meeting interesting people!');
  location = signal('Downtown District, City');
  joinDate = new Date('2024-01-15');

  notifications = signal({
    messages: true,
    marketplace: true,
    community: false,
    email: true
  });

  privacy = signal({
    profileVisibility: 'public',
    showEmail: false,
    showLastSeen: true
  });

  mockReviews = [
    {
      id: '1',
      reviewer: 'Sarah Miller',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b86b8b9e?w=50&h=50&fit=crop&crop=face',
      rating: 5,
      comment: 'Great communication and very professional!',
      date: new Date('2024-09-20')
    },
    {
      id: '2',
      reviewer: 'Mike Johnson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
      rating: 5,
      comment: 'Reliable and trustworthy community member.',
      date: new Date('2024-09-15')
    }
  ];

  stars = Array.from({ length: 5 });

  mockStats = computed(() => {
    const user = this.currentUser();
    return {
      totalConnections: 24,
      businessRoles: user?.roles.length || 0,
      communityScore: 4.6,
      responseRate: 95
    };
  });

  startEditing(user: User): void {
    this.editedUser.set({ ...user });
    this.isEditing.set(true);
  }

  handleSave(): void {
    const updated = this.editedUser();
    if (!updated) return;
    this.authService.updateUser(updated);
    this.isEditing.set(false);
  }

  handleCancel(): void {
    this.editedUser.set(null);
    this.isEditing.set(false);
  }

  updateEditedUser(field: 'name' | 'email', value: string): void {
    const current = this.editedUser();
    if (!current) return;
    this.editedUser.set({ ...current, [field]: value });
  }

  updateNotifications(update: Partial<{ messages: boolean; marketplace: boolean; community: boolean; email: boolean }>): void {
    this.notifications.update(prev => ({ ...prev, ...update }));
  }

  updatePrivacy(update: Partial<{ showEmail: boolean; showLastSeen: boolean }>): void {
    this.privacy.update(prev => ({ ...prev, ...update }));
  }

  onTabClick(tab: string): void {
    if (tab === 'profile' || tab === 'settings' || tab === 'privacy') {
      this.activeTab.set(tab);
    }
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('');
  }
}
