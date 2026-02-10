import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { User, UserRole } from '../../../models';
import {
  CardComponent,
  CardContentComponent,
  CardHeaderComponent,
  CardTitleComponent,
  ButtonComponent,
  InputComponent,
  LabelComponent,
  TextareaComponent,
  BadgeComponent,
  DialogComponent,
  DialogDescriptionComponent,
  DialogHeaderComponent,
  DialogTitleComponent,
  SelectComponent,
  SwitchComponent
} from '../../ui';
import { ImageWithFallbackComponent } from '../../figma/image-with-fallback/image-with-fallback.component';

@Component({
  selector: 'app-my-businesses',
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
    BadgeComponent,
    DialogComponent,
    DialogDescriptionComponent,
    DialogHeaderComponent,
    DialogTitleComponent,
    SelectComponent,
    SwitchComponent,
    ImageWithFallbackComponent
  ],
  template: `
    <div class="h-full overflow-y-auto bg-background">
      <div class="max-w-6xl mx-auto p-6">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h1>My Businesses</h1>
            <p class="text-muted-foreground">
              Manage your services and business listings
            </p>
          </div>

          <app-dialog [open]="isDialogOpen()" (openChange)="isDialogOpen.set($event)">
            <div dialogTrigger>
              <app-button (click)="openCreateDialog()">
                <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Add Business
              </app-button>
            </div>

            <div dialogContent class="max-w-2xl">
              <app-dialog-header>
                <app-dialog-title>
                  {{ editingRole() ? 'Edit Business' : 'Add New Business' }}
                </app-dialog-title>
                <app-dialog-description>
                  {{ editingRole() ? 'Update your business information' : 'Create a new business listing to showcase your services' }}
                </app-dialog-description>
              </app-dialog-header>

              <div class="grid gap-4 py-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <app-label for="title">Business Name *</app-label>
                    <app-input
                      id="title"
                      [ngModel]="formData().title"
                      (ngModelChange)="updateForm('title', $event)"
                      placeholder="Enter business name">
                    </app-input>
                  </div>

                  <div>
                    <app-label for="category">Category *</app-label>
                    <app-select
                      [options]="categoryOptions"
                      [ngModel]="formData().category"
                      (ngModelChange)="updateForm('category', $event)"
                      placeholder="Select category">
                    </app-select>
                  </div>
                </div>

                <div>
                  <app-label for="description">Description *</app-label>
                  <app-textarea
                    id="description"
                    [ngModel]="formData().description"
                    (ngModelChange)="updateForm('description', $event)"
                    placeholder="Describe your services and what makes you unique"
                    [rows]="3">
                  </app-textarea>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <app-label for="location">Location</app-label>
                    <app-input
                      id="location"
                      [ngModel]="formData().location"
                      (ngModelChange)="updateForm('location', $event)"
                      placeholder="Enter your location">
                    </app-input>
                  </div>

                  <div>
                    <app-label for="price">Price Range</app-label>
                    <app-select
                      [options]="priceOptions"
                      [ngModel]="formData().price"
                      (ngModelChange)="updateForm('price', $event)">
                    </app-select>
                  </div>
                </div>

                <div>
                  <app-label for="image">Business Image URL</app-label>
                  <app-input
                    id="image"
                    [ngModel]="formData().image"
                    (ngModelChange)="updateForm('image', $event)"
                    placeholder="Enter image URL or upload an image">
                  </app-input>
                </div>

                <div class="flex gap-2 pt-4">
                  <app-button (click)="handleCreateOrUpdate()">
                    <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2zM17 21v-8H7v8" />
                    </svg>
                    {{ editingRole() ? 'Update Business' : 'Create Business' }}
                  </app-button>
                  <app-button variant="outline" (click)="closeDialog()">
                    <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 6L6 18M6 6l12 12" />
                    </svg>
                    Cancel
                  </app-button>
                </div>
              </div>
            </div>
          </app-dialog>
        </div>

        @if (currentUser(); as user) {
          @if (user.roles.length > 0) {
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <app-card>
                <app-card-content class="p-4">
                  <div class="flex items-center gap-2 mb-2">
                    <svg class="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    <span class="text-sm font-medium">Profile Views</span>
                  </div>
                  <div class="text-2xl font-bold text-primary">{{ mockAnalytics.totalViews }}</div>
                  <div class="flex items-center gap-1 text-xs text-green-600 mt-1">
                    <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M23 6l-9.5 9.5-5-5L1 18" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M23 6v6h-6" />
                    </svg>
                    <span>+12% this week</span>
                  </div>
                </app-card-content>
              </app-card>

              <app-card>
                <app-card-content class="p-4">
                  <div class="flex items-center gap-2 mb-2">
                    <svg class="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span class="text-sm font-medium">Inquiries</span>
                  </div>
                  <div class="text-2xl font-bold text-primary">{{ mockAnalytics.totalInquiries }}</div>
                  <div class="flex items-center gap-1 text-xs text-green-600 mt-1">
                    <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M23 6l-9.5 9.5-5-5L1 18" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M23 6v6h-6" />
                    </svg>
                    <span>+5 this week</span>
                  </div>
                </app-card-content>
              </app-card>

              <app-card>
                <app-card-content class="p-4">
                  <div class="flex items-center gap-2 mb-2">
                    <svg class="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10m-12 10h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span class="text-sm font-medium">Response Rate</span>
                  </div>
                  <div class="text-2xl font-bold text-primary">{{ mockAnalytics.responseRate }}%</div>
                  <div class="text-xs text-muted-foreground mt-1">Last 30 days</div>
                </app-card-content>
              </app-card>

              <app-card>
                <app-card-content class="p-4">
                  <div class="flex items-center gap-2 mb-2">
                    <svg class="h-4 w-4 text-muted-foreground" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span class="text-sm font-medium">Avg Rating</span>
                  </div>
                  <div class="text-2xl font-bold text-primary">{{ mockAnalytics.avgRating }}</div>
                  <div class="flex items-center mt-1">
                    @for (star of stars; track $index) {
                      <svg
                        class="h-3 w-3"
                        [class.fill-current]="$index < Math.floor(mockAnalytics.avgRating)"
                        [class.text-yellow-500]="$index < Math.floor(mockAnalytics.avgRating)"
                        [class.text-gray-300]="$index >= Math.floor(mockAnalytics.avgRating)"
                        viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    }
                  </div>
                </app-card-content>
              </app-card>
            </div>
          }

          <div class="mb-8">
            <h2 class="text-xl font-semibold mb-4">
              Your Businesses ({{ user.roles.length }})
            </h2>

            @if (user.roles.length > 0) {
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                @for (role of user.roles; track role.id) {
                  <app-card class="overflow-hidden">
                    @if (role.image) {
                      <div class="relative">
                        <app-image-with-fallback
                          [src]="role.image"
                          [alt]="role.title"
                          class="w-full h-48 object-cover">
                        </app-image-with-fallback>
                        <div class="absolute top-2 right-2 flex gap-2">
                          <app-button variant="secondary" size="sm" (click)="handleEdit(role)">
                            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
                            </svg>
                          </app-button>
                        </div>
                        <div class="absolute top-2 left-2">
                          <app-badge [variant]="role.isActive ? 'default' : 'secondary'">
                            {{ role.isActive ? 'Active' : 'Inactive' }}
                          </app-badge>
                        </div>
                      </div>
                    }

                    <app-card-content class="p-4">
                      <div class="flex items-start justify-between mb-2">
                        <div class="flex-1">
                          <h3 class="font-semibold mb-1">{{ role.title }}</h3>
                          <app-badge variant="outline" class="text-xs mb-2">
                            {{ role.category }}
                          </app-badge>
                        </div>
                        @if (role.rating > 0) {
                          <div class="text-right">
                            <div class="flex items-center gap-1 mb-1">
                              <svg class="h-4 w-4 fill-current text-yellow-500" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                              <span class="text-sm font-medium">{{ role.rating }}</span>
                            </div>
                            <p class="text-xs text-muted-foreground">({{ role.reviews }} reviews)</p>
                          </div>
                        }
                      </div>

                      <p class="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {{ role.description }}
                      </p>

                      <div class="flex items-center justify-between mb-3">
                        @if (role.location) {
                          <div class="flex items-center gap-1 text-sm text-muted-foreground">
                            <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{{ role.location }}</span>
                          </div>
                        }
                        @if (role.price) {
                          <span class="font-medium text-primary">{{ role.price }}</span>
                        }
                      </div>

                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                          <span class="text-sm text-muted-foreground">Status:</span>
                          <app-switch
                            [checked]="role.isActive"
                            (checkedChange)="toggleRoleStatus(role.id)">
                          </app-switch>
                        </div>

                        <div class="flex items-center gap-1">
                          <app-button variant="outline" size="sm" (click)="handleEdit(role)">
                            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
                            </svg>
                          </app-button>
                          <app-button variant="outline" size="sm" (click)="handleDelete(role.id)">
                            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 11v6M14 11v6" />
                            </svg>
                          </app-button>
                        </div>
                      </div>
                    </app-card-content>
                  </app-card>
                }
              </div>
            } @else {
              <app-card>
                <app-card-content class="p-8 text-center">
                  <div class="text-6xl mb-4">{{ noBusinessesEmoji }}</div>
                  <h3 class="text-lg font-medium mb-2">No businesses yet</h3>
                  <p class="text-muted-foreground mb-4">
                    Start by adding your first business or service listing
                  </p>
                  <app-button (click)="openCreateDialog()">
                    <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Your First Business
                  </app-button>
                </app-card-content>
              </app-card>
            }
          </div>

          @if (user.roles.length > 0) {
            <app-card>
              <app-card-header>
                <app-card-title class="flex items-center gap-2">
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Recent Inquiries
                </app-card-title>
              </app-card-header>
              <app-card-content>
                @if (mockInquiries.length > 0) {
                  <div class="space-y-4">
                    @for (inquiry of mockInquiries; track inquiry.id) {
                      <div class="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                        <div class="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
                          {{ inquiry.customer[0] }}
                        </div>
                        <div class="flex-1">
                          <div class="flex items-center gap-2 mb-1">
                            <span class="font-medium">{{ inquiry.customer }}</span>
                            <app-badge [variant]="inquiry.status === 'pending' ? 'default' : 'secondary'" class="text-xs">
                              {{ inquiry.status }}
                            </app-badge>
                            <span class="text-sm text-muted-foreground">
                              {{ inquiry.date.toLocaleDateString() }}
                            </span>
                          </div>
                          <p class="text-sm text-muted-foreground mb-1">Re: {{ inquiry.service }}</p>
                          <p class="text-sm">{{ inquiry.message }}</p>
                        </div>
                        <app-button variant="outline" size="sm">Reply</app-button>
                      </div>
                    }
                  </div>
                } @else {
                  <div class="text-center py-8 text-muted-foreground">
                    <svg class="h-12 w-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p>No inquiries yet</p>
                    <p class="text-sm">Customer inquiries will appear here</p>
                  </div>
                }
              </app-card-content>
            </app-card>
          }
        }
      </div>
    </div>
  `
})
export class MyBusinessesComponent {
  private authService = inject(AuthService);

  currentUser = this.authService.currentUser;

  isDialogOpen = signal(false);
  editingRole = signal<UserRole | null>(null);
  formData = signal({
    title: '',
    category: '',
    description: '',
    location: '',
    price: '$',
    image: ''
  });

  noBusinessesEmoji = '\u{1F3EA}';

  categories = [
    'Food & Beverage',
    'Personal Care',
    'Home & Garden',
    'Technology',
    'Health & Fitness',
    'Education',
    'Professional Services',
    'Arts & Crafts',
    'Automotive',
    'Other'
  ];

  priceRanges = ['$', '$$', '$$$', '$$$$'];

  categoryOptions = this.categories.map(category => ({ value: category, label: category }));
  priceOptions = this.priceRanges.map(price => ({ value: price, label: price }));

  mockAnalytics = {
    totalViews: 1234,
    totalInquiries: 45,
    responseRate: 94,
    avgRating: 4.7
  };

  mockInquiries = [
    {
      id: '1',
      customer: 'Alice Johnson',
      service: 'Custom Cake Order',
      message: 'Hi! I\'d like to order a custom birthday cake for next weekend.',
      date: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'pending'
    },
    {
      id: '2',
      customer: 'Bob Smith',
      service: 'Consultation',
      message: 'Could we schedule a consultation for my garden renovation?',
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      status: 'responded'
    }
  ];

  stars = Array.from({ length: 5 });
  Math = Math;

  updateForm(field: keyof { title: string; category: string; description: string; location: string; price: string; image: string }, value: string): void {
    this.formData.update(prev => ({ ...prev, [field]: value }));
  }

  openCreateDialog(): void {
    this.editingRole.set(null);
    this.formData.set({
      title: '',
      category: '',
      description: '',
      location: '',
      price: '$',
      image: ''
    });
    this.isDialogOpen.set(true);
  }

  closeDialog(): void {
    this.isDialogOpen.set(false);
    this.editingRole.set(null);
  }

  handleCreateOrUpdate(): void {
    const user = this.currentUser();
    if (!user) return;

    const data = this.formData();
    if (!data.title || !data.category || !data.description) {
      alert('Please fill in all required fields');
      return;
    }

    const newRole: UserRole = {
      id: this.editingRole()?.id || Date.now().toString(),
      title: data.title,
      category: data.category,
      description: data.description,
      location: data.location,
      price: data.price,
      image: data.image,
      rating: this.editingRole()?.rating || 0,
      reviews: this.editingRole()?.reviews || 0,
      isActive: true
    };

    const updatedRoles = this.editingRole()
      ? user.roles.map(role => role.id === this.editingRole()?.id ? newRole : role)
      : [...user.roles, newRole];

    this.authService.updateUser({
      ...user,
      roles: updatedRoles
    });

    this.formData.set({
      title: '',
      category: '',
      description: '',
      location: '',
      price: '$',
      image: ''
    });
    this.editingRole.set(null);
    this.isDialogOpen.set(false);
  }

  handleEdit(role: UserRole): void {
    this.editingRole.set(role);
    this.formData.set({
      title: role.title,
      category: role.category,
      description: role.description,
      location: role.location,
      price: role.price || '$',
      image: role.image || ''
    });
    this.isDialogOpen.set(true);
  }

  handleDelete(roleId: string): void {
    const user = this.currentUser();
    if (!user) return;

    if (confirm('Are you sure you want to delete this business listing?')) {
      const updatedRoles = user.roles.filter(role => role.id !== roleId);
      this.authService.updateUser({
        ...user,
        roles: updatedRoles
      });
    }
  }

  toggleRoleStatus(roleId: string): void {
    const user = this.currentUser();
    if (!user) return;

    const updatedRoles = user.roles.map(role =>
      role.id === roleId ? { ...role, isActive: !role.isActive } : role
    );

    this.authService.updateUser({
      ...user,
      roles: updatedRoles
    });
  }
}
